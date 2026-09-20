import { act, fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { installMediaQueries } from "@/tests/helpers/media";
import { DashboardEmbeds } from "./DashboardEmbeds";

it("provides titled embeds and direct mobile destinations across viewport changes", () => {
  const change = installMediaQueries({ "(min-width: 1024px)": true });
  const { container } = render(<DashboardEmbeds />);
  const frames = Array.from(container.querySelectorAll("iframe"));
  expect(frames.length).toBeGreaterThan(0);
  for (const frame of frames) {
    expect(frame.title.trim()).not.toBe("");
    expect(new URL(frame.src).protocol).toBe("https:");
    fireEvent.load(frame);
  }
  act(() => change("(min-width: 1024px)", false));
  for (const link of screen.getAllByRole("link")) {
    expect(link).toHaveAccessibleName();
    expect(link).toHaveAttribute("href", expect.stringContaining("https://public.tableau.com/"));
  }
  act(() => change("(min-width: 1024px)", true));
  expect(container.querySelectorAll("iframe")).toHaveLength(frames.length);
});
