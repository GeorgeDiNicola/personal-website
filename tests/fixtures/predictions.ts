import { utils, write } from "xlsx";

export const predictionHeader = [
  "Next Episode Number", "Next Episode Date", "Contestant First Name",
  "Contestant Last Name", "Prediction", "Win Probability", "Result", "Status",
];

export const predictionRows = [
  predictionHeader,
  [1, "2026-07-21", "Alex", "One", 1, 75, 1, "Closed"],
  [2, "2026-07-22", "Blair", "Two", 0, 25, 1, "Closed"],
  [3, "2026-07-23", "Casey", "Three", 0, 40, null, "Pending"],
];

/** Produce a real workbook so tests cover the download/parser boundary. */
export function predictionWorkbook(rows: unknown[][] = predictionRows): Buffer {
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, utils.aoa_to_sheet(rows), "Predictions");
  return write(workbook, { type: "buffer", bookType: "xlsx" }) as Buffer;
}
