import { render, screen, waitFor } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import HomePage from "@/app/page";
import PersonalPage from "@/app/personal/page";
import JeopardyPage from "@/app/projects/jeopardy/page";
import RadioPage from "@/app/projects/radio-antenna/page";
import DashboardsPage from "@/app/data-visualizations/page";
import { installMediaQueries } from "../helpers/media";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

for (const Page of [HomePage, PersonalPage, JeopardyPage, RadioPage, DashboardsPage]) {
  it.each([false, true])(`${Page.name} exposes navigation and readable content (reduced motion=%s)`, async (reduce) => {
    installMediaQueries({ "(prefers-reduced-motion: reduce)": reduce });
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    render(<Page />);
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(document.getElementById("main-content")).toHaveAttribute("tabindex", "-1");
    for (const link of screen.getAllByRole("link")) {
      expect(link).toHaveAccessibleName();
      expect(link.getAttribute("href")?.trim()).toBeTruthy();
    }
    await waitFor(() => expect(screen.queryByText(/loading photos|loading the latest prediction/i)).not.toBeInTheDocument());
  });
}
