export const JEOPARDY_WORKBOOK_URL =
  "https://www.kaggle.com/api/v1/datasets/download/georgejdinicola/jeopardy-predictions/jeopardy-predictions.xlsx";

/** Fetch the latest public workbook on each visit, without a build-time snapshot. */
export async function fetchPredictions(signal: AbortSignal): Promise<JeopardyPrediction[]> {
  const response = await fetch(JEOPARDY_WORKBOOK_URL, {
    cache: "no-store",
    credentials: "omit",
    signal
  });
  if (!response.ok) throw new Error(`Kaggle returned ${response.status}.`);

  const data = await response.arrayBuffer();
  const signature = new Uint8Array(data, 0, Math.min(data.byteLength, 4));
  if (signature[0] !== 0x50 || signature[1] !== 0x4b || signature[2] !== 3 || signature[3] !== 4) {
    throw new Error("Kaggle did not return an Excel workbook.");
  }

  // Loading the parser separately keeps it out of the initial page bundle.
  const { read, utils, SSF } = await import("xlsx");
  signal.throwIfAborted();
  const workbook = read(data, { type: "array", cellHTML: false, cellFormula: false });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  if (!sheet) throw new Error("The workbook has no worksheet.");

  const rows = utils.sheet_to_json<unknown[]>(sheet, { header: 1, raw: true, defval: null });
  const dateIndex = rows[0]?.indexOf("Next Episode Date") ?? -1;
  for (const row of rows.slice(1)) {
    const value = row[dateIndex];
    if (typeof value !== "number") continue;
    const date = SSF.parse_date_code(value, { date1904: workbook.Workbook?.WBProps?.date1904 });
    if (date) {
      // Excel stores calendar dates as serials, not instants in a visitor's time zone.
      row[dateIndex] = `${date.y}-${String(date.m).padStart(2, "0")}-${String(date.d).padStart(2, "0")}`;
    }
  }
  return normalizePredictions(rows);
}

export type PredictionOutcome = "correct" | "incorrect" | "pending";

export type JeopardyPrediction = {
  episode: number;
  date: string;
  name: string;
  hometown: string;
  predictedWin: boolean;
  winProbability: number;
  actualWin: boolean | null;
  outcome: PredictionOutcome;
};

const requiredColumns = [
  "Next Episode Number",
  "Next Episode Date",
  "Contestant First Name",
  "Contestant Last Name",
  "Prediction",
  "Win Probability",
  "Result",
  "Status"
];

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function number(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim()) return Number(value);
  return NaN;
}

function binary(value: unknown): boolean | null {
  const parsed = number(value);
  return parsed === 1 ? true : parsed === 0 ? false : null;
}

/** Validate dataset rows without dropping malformed predictions or changing row order. */
export function normalizePredictions(rows: unknown[][]): JeopardyPrediction[] {
  const [header, ...body] = rows;
  if (!header || !requiredColumns.every((column) => header.includes(column))) {
    throw new Error("The prediction workbook is missing required columns.");
  }

  const predictions = body
    .filter((row) => row.some((value) => value != null && (typeof value !== "string" || value.trim() !== "")))
    .map((row): JeopardyPrediction => {
      const get = (column: string): unknown => row[header.indexOf(column)];
      const episode = number(get("Next Episode Number"));
      const date = text(get("Next Episode Date"));
      const firstName = text(get("Contestant First Name"));
      const lastName = text(get("Contestant Last Name"));
      const predictedWin = binary(get("Prediction"));
      const winProbability = number(get("Win Probability"));
      const result = get("Result");
      const actualWin = binary(result);
      const status = text(get("Status")).toLowerCase();
      const dateValue = new Date(`${date}T00:00:00Z`);

      if (
        !Number.isInteger(episode) || episode <= 0 ||
        !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
        !Number.isFinite(dateValue.getTime()) || dateValue.toISOString().slice(0, 10) !== date ||
        !firstName || !lastName || predictedWin === null ||
        !Number.isFinite(winProbability) || winProbability < 0 || winProbability > 100 ||
        (status !== "closed" && status !== "pending") ||
        (result != null && !(typeof result === "string" && result.trim() === "") && actualWin === null)
      ) {
        throw new Error("A prediction contains an unexpected value.");
      }

      // An open prediction must not affect accuracy, even if a result cell is populated.
      const settled = status === "closed" && actualWin !== null;
      return {
        episode,
        date,
        name: `${firstName} ${lastName}`,
        hometown: [text(get("Home City")), text(get("Home State"))].filter(Boolean).join(", "),
        predictedWin,
        winProbability,
        actualWin: settled ? actualWin : null,
        outcome: settled ? (predictedWin === actualWin ? "correct" : "incorrect") : "pending"
      };
    });

  if (!predictions.length) throw new Error("The prediction workbook is empty.");
  if (new Set(predictions.map((prediction) => prediction.episode)).size !== predictions.length) {
    throw new Error("The prediction workbook contains duplicate episodes.");
  }
  return predictions;
}

/** Calculate evaluation metrics from completed games only. */
export function summarizePredictions(predictions: JeopardyPrediction[]) {
  const settledPredictions = predictions.filter((prediction) => prediction.actualWin !== null);
  const correct = settledPredictions.filter((prediction) => prediction.outcome === "correct").length;
  const incorrect = settledPredictions.filter((prediction) => prediction.outcome === "incorrect").length;
  const settled = correct + incorrect;
  const truePositives = settledPredictions.filter((prediction) => prediction.predictedWin && prediction.actualWin).length;
  const falsePositives = settledPredictions.filter((prediction) => prediction.predictedWin && !prediction.actualWin).length;
  const falseNegatives = settledPredictions.filter((prediction) => !prediction.predictedWin && prediction.actualWin).length;
  return {
    correct,
    incorrect,
    pending: predictions.length - settled,
    settled,
    accuracy: settled ? (correct / settled) * 100 : null,
    precision: truePositives + falsePositives ? (truePositives / (truePositives + falsePositives)) * 100 : null,
    recall: truePositives + falseNegatives ? (truePositives / (truePositives + falseNegatives)) * 100 : null
  };
}

export function formatPredictionDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short", day: "numeric", year: "numeric", timeZone: "UTC"
  }).format(new Date(`${date}T00:00:00Z`));
}
