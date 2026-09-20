import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { predictionRows, predictionWorkbook } from "@/tests/fixtures/predictions";
import { JeopardyPredictionSection } from "./JeopardyPredictionSection";

function response(rows = predictionRows): Response {
  return new Response(new Uint8Array(predictionWorkbook(rows)));
}

it("renders workbook results and lets the visitor explore prediction history", async () => {
  const user = userEvent.setup();
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response()));
  render(<JeopardyPredictionSection isDark={false} />);
  expect(screen.getByRole("status")).toHaveTextContent(/loading/i);
  const history = await screen.findByRole("group", { name: /prediction history/i });
  const buttons = within(history).getAllByRole("button");
  expect(buttons).toHaveLength(3);
  expect(buttons[2]).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByText(/50.0% accuracy/)).toBeInTheDocument();
  for (const [index, name] of ["Alex One", "Blair Two", "Casey Three"].entries()) {
    await user.click(buttons[index]);
    expect(buttons[index]).toHaveAttribute("aria-pressed", "true");
    const detail = document.getElementById(buttons[index].getAttribute("aria-controls")!)!;
    expect(detail).toHaveTextContent(name);
    expect(detail).toHaveAttribute("aria-live", "polite");
  }
});

it("lets the visitor retry after a failed request", async () => {
  const user = userEvent.setup();
  const fetch = vi.fn().mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce(response());
  vi.stubGlobal("fetch", fetch);
  render(<JeopardyPredictionSection isDark />);
  await user.click(await screen.findByRole("button", { name: /try again/i }));
  expect(await screen.findByRole("group", { name: /prediction history/i })).toBeInTheDocument();
  expect(fetch).toHaveBeenCalledTimes(2);
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
});

it("handles an all-pending workbook without inventing an accuracy", async () => {
  const rows = [predictionRows[0], [9, "2026-07-23", "New", "Champion", 1, 80, null, "Pending"]];
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response(rows)));
  render(<JeopardyPredictionSection isDark={false} />);
  expect(await screen.findByText(/no accuracy available/i)).toBeInTheDocument();
  expect(screen.getByText(/predicted to win/i)).toBeInTheDocument();
});

it("aborts an in-flight request when leaving the page", async () => {
  let signal: AbortSignal | undefined;
  let resolve: ((response: Response) => void) | undefined;
  vi.stubGlobal("fetch", vi.fn((_url: string, options: RequestInit) => {
    signal = options.signal ?? undefined;
    return new Promise<Response>((done) => { resolve = done; });
  }));
  const { unmount } = render(<JeopardyPredictionSection isDark={false} />);
  unmount();
  expect(signal?.aborted).toBe(true);
  await act(async () => resolve?.(response()));
  expect(screen.queryByRole("group")).not.toBeInTheDocument();
});

it("offers recovery when a request times out", async () => {
  vi.useFakeTimers();
  vi.stubGlobal("fetch", vi.fn((_url: string, options: RequestInit) => new Promise<Response>((_resolve, reject) => {
    options.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
  })));
  render(<JeopardyPredictionSection isDark={false} />);
  await act(async () => { await vi.advanceTimersByTimeAsync(20_000); });
  vi.useRealTimers();
  await waitFor(() => expect(screen.getByRole("button", { name: /try again/i })).toBeEnabled());
});
