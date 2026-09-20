import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { EducationSection } from "./EducationSection";
import { WorkHistorySection } from "./WorkHistorySection";
import { ProjectsSection } from "./ProjectsSection";
import { ThemeToggle } from "./ThemeToggle";
import { installMediaQueries } from "@/tests/helpers/media";

it("renders optional education and work details when supplied", () => {
  installMediaQueries({ "(prefers-reduced-motion: reduce)": true });
  render(<>
    <EducationSection schools={[
      { name: "Example school", period: "2020", degree1: "First degree", degree2: "Second degree", minor: "Example minor", concentration: "Example concentration" },
      { name: "Other school", period: "2021", degree1: "Only degree" },
    ]} />
    <WorkHistorySection workHistory={[
      { role: "Engineer", company: "Example company", period: "2022", department: "Example department", summary: "Built useful software" },
      { role: "Developer", company: "Other company", period: "2023", summary: "Maintained useful software" },
    ]} />
  </>);
  for (const text of ["Second degree", /Example minor/, /Example concentration/, "Only degree", "Example department", "Built useful software"]) {
    expect(screen.getByText(text)).toBeInTheDocument();
  }
});

it("distinguishes internal, external and unavailable project destinations", () => {
  installMediaQueries({ "(prefers-reduced-motion: reduce)": true });
  render(<ProjectsSection projects={[
    { title: "Internal fixture", description: "Example", link: " /projects/example/ ", featured: true, tags: ["TypeScript"] },
    { title: "External fixture", description: "Example", link: "https://example.com" },
    { title: "Unavailable fixture", description: "Example", link: "   ", tags: [] },
  ]} />);
  expect(screen.getByRole("link", { name: /internal fixture/i })).toHaveAttribute("href", expect.stringMatching(/^\/projects\/example\/?$/));
  expect(screen.getByRole("link", { name: /internal fixture/i })).not.toHaveAttribute("target");
  expect(screen.getByRole("link", { name: /external fixture/i })).toHaveAttribute("rel", expect.stringContaining("noopener"));
  expect(screen.getByRole("button", { name: /unavailable fixture/i })).toBeDisabled();
});

it.each(["light", "dark"])("the standalone theme control supports explicit choices from %s", async (theme) => {
  const user = userEvent.setup();
  const onThemeChange = vi.fn();
  render(<ThemeToggle theme={theme} onThemeChange={onThemeChange} />);
  await user.click(screen.getByRole("button", { name: /light mode/i }));
  expect(onThemeChange).toHaveBeenLastCalledWith("light");
  await user.click(screen.getByRole("button", { name: /dark mode/i }));
  expect(onThemeChange).toHaveBeenLastCalledWith("dark");
});
