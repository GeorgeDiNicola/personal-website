import assert from "node:assert/strict";
import test from "node:test";

import { utils, write } from "xlsx";

import { fetchPredictions, normalizePredictions, summarizePredictions, formatPredictionDate } from "./jeopardy-data.ts";

const header = [
  "Next Episode Number", "Next Episode Date", "Contestant First Name",
  "Contestant Last Name", "Prediction", "Win Probability", "Result", "Status"
];

test("uses the last nonempty row as latest without reordering the source", () => {
  const predictions = normalizePredictions([
    header,
    [2, "2026-07-28", "SECOND", "CHAMPION", 1, 70, 1, "Closed"],
    [1, "2026-07-27", "LATEST", "CHAMPION", 0, 30, null, "Pending"],
    [null, null, null],
    [" ", ""],
    []
  ]);
  assert.equal(predictions.length, 2);
  assert.equal(predictions.at(-1).name, "LATEST CHAMPION");
  assert.equal(predictions.at(-1).winProbability, 30);
});

test("scores both predicted wins and losses and excludes pending results", () => {
  const summary = summarizePredictions(normalizePredictions([
    header,
    [1, "2026-07-21", "A", "ONE", 1, 70, 1, "Closed"],
    [2, "2026-07-22", "B", "TWO", 0, 30, 0, "Closed"],
    [3, "2026-07-23", "C", "THREE", 1, 60, 0, "Closed"],
    [4, "2026-07-24", "D", "FOUR", 0, 40, null, "Pending"]
  ]));
  assert.equal(summary.correct, 2);
  assert.equal(summary.incorrect, 1);
  assert.equal(summary.pending, 1);
  assert.equal(summary.settled, 3);
  assert.ok(Math.abs(summary.accuracy - 200 / 3) < 1e-10);
});

test("blank results never become losses; open rows never count as settled", () => {
  const predictions = normalizePredictions([
    header,
    [1, "2026-07-21", "A", "ONE", "0", 0, "", "Closed"],
    [2, "2026-07-22", "B", "TWO", "1", 100, 1, "Pending"]
  ]);
  assert.ok(predictions.every((prediction) => prediction.actualWin === null));
  assert.equal(summarizePredictions(predictions).accuracy, null);
});

test("rejects incomplete schemas, empty workbooks, and malformed latest rows", () => {
  assert.throws(() => normalizePredictions([]));
  assert.throws(() => normalizePredictions([header]));
  assert.throws(() => normalizePredictions([["Prediction"], [1]]));
  assert.throws(() => normalizePredictions([
    header,
    [1, "2026-07-21", "A", "ONE", 1, 70, 1, "Closed"],
    [2, "2026-07-22", "B", "TWO", 1, "", null, "Pending"]
  ]));
});

test("rejects invalid probabilities, dates, outcomes, and duplicate episodes", () => {
  const valid = [1, "2026-07-21", "A", "ONE", 1, 70, 1, "Closed"];
  for (const [column, value] of [[5, 101], [5, -1], [4, 2], [6, "unknown"], [1, "2026-02-30"], [7, "unknown"]]) {
    const row = [...valid];
    row[column] = value;
    assert.throws(() => normalizePredictions([header, row]));
  }
  assert.throws(() => normalizePredictions([header, valid, valid]));
});

test("formats episode dates without shifting the calendar day", () => {
  assert.equal(formatPredictionDate("2026-07-27"), "Jul 27, 2026");
});

test("reads a downloaded XLSX and respects both Excel date systems", async (context) => {
  for (const date1904 of [false, true]) {
    const epoch = date1904 ? Date.UTC(1904, 0, 1) : Date.UTC(1899, 11, 30);
    const serial = (Date.UTC(2026, 6, 27) - epoch) / 86_400_000;
    const workbook = utils.book_new();
    workbook.Workbook = { WBProps: { date1904 } };
    utils.book_append_sheet(workbook, utils.aoa_to_sheet([
      header,
      [1, serial, "TEST", "CHAMPION", 1, 60.5, null, "Pending"]
    ]), "Predictions");
    const bytes = write(workbook, { type: "buffer", bookType: "xlsx" });
    context.mock.method(globalThis, "fetch", async (_url, options) => {
      assert.equal(options.cache, "no-store");
      assert.equal(options.credentials, "omit");
      return new Response(bytes);
    });
    const predictions = await fetchPredictions(new AbortController().signal);
    assert.equal(predictions[0].date, "2026-07-27");
    assert.equal(predictions[0].winProbability, 60.5);
    assert.equal(predictions[0].outcome, "pending");
    context.mock.restoreAll();
  }
});

test("rejects upstream errors and HTML responses instead of displaying bogus data", async (context) => {
  context.mock.method(globalThis, "fetch", async () => new Response("Unavailable", { status: 503 }));
  await assert.rejects(fetchPredictions(new AbortController().signal), /503/);
  context.mock.restoreAll();
  context.mock.method(globalThis, "fetch", async () => new Response("<html>Sign in</html>"));
  await assert.rejects(fetchPredictions(new AbortController().signal), /Excel workbook/);
});
