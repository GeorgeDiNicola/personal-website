import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import { ChessGamesSection } from "./ChessGamesSection";

it("keeps the selected game, iframe, external link and theme in sync", async () => {
  const user = userEvent.setup();
  const { rerender } = render(<ChessGamesSection isDark={false} />);
  const initial = screen.getByTitle(/chess game/i).getAttribute("src");
  await user.click(screen.getByRole("button", { name: /previous game/i }));
  expect(screen.getByTitle(/chess game/i)).not.toHaveAttribute("src", initial);
  await user.click(screen.getByRole("button", { name: /next game/i }));
  expect(screen.getByTitle(/chess game/i)).toHaveAttribute("src", initial);
  const choices = screen.getAllByRole("button", { name: /view chess game/i });
  await user.click(choices[1]);
  expect(choices[1]).toHaveAttribute("aria-pressed", "true");
  expect(choices[0]).toHaveAttribute("aria-pressed", "false");
  rerender(<ChessGamesSection isDark />);
  const frame = screen.getByTitle(/chess game/i);
  expect(new URL(frame.getAttribute("src")!).searchParams.get("theme")).toBe("dark");
  expect(screen.getByRole("link")).toHaveAttribute("href", frame.getAttribute("src"));
  expect(screen.getByRole("link")).toHaveAttribute("rel", expect.stringContaining("noopener"));
});

it("rejects untrusted resize messages and locks the first valid height", () => {
  render(<ChessGamesSection isDark={false} />);
  const frame = screen.getByTitle(/chess game/i) as HTMLIFrameElement;
  const originalHeight = frame.style.height;
  const valid = { id: frame.id, frameHeight: 700 };
  const send = (data: unknown, origin = "https://www.chess.com", source: MessageEventSource | null = frame.contentWindow) => {
    fireEvent(window, new MessageEvent("message", { data, origin, source }));
  };
  send(valid, "https://www.chess.com.evil.example");
  send(valid, "https://www.chess.com", window);
  for (const data of [null, "invalid", {}, { ...valid, id: "unknown" }, ...[NaN, Infinity, 0, 319, 1201, "700"].map((frameHeight) => ({ ...valid, frameHeight }))]) {
    send(data);
    expect(frame.style.height).toBe(originalHeight);
  }
  send(valid);
  expect(parseFloat(frame.style.height)).toBeGreaterThan(valid.frameHeight);
  const acceptedHeight = frame.style.height;
  send({ ...valid, frameHeight: 800 });
  expect(frame.style.height).toBe(acceptedHeight);
});

it.each([320, 1200])("accepts a trusted boundary height of %s", (frameHeight) => {
  render(<ChessGamesSection isDark={false} />);
  const frame = screen.getByTitle(/chess game/i) as HTMLIFrameElement;
  const initialHeight = frame.style.height;
  fireEvent(window, new MessageEvent("message", { origin: "https://www.chess.com", source: frame.contentWindow, data: { id: frame.id, frameHeight } }));
  expect(frame.style.height).not.toBe(initialHeight);
  expect(parseFloat(frame.style.height)).toBeGreaterThan(frameHeight);
});
