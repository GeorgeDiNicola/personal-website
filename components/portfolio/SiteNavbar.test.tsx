import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { SiteNavbar } from "./SiteNavbar";
import { useThemePreference } from "./useThemePreference";
import { useTextColorPreference } from "./useTextColorPreference";

const route = vi.hoisted(() => ({ pathname: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => route.pathname }));

function Preferences() {
  const { theme, setTheme, isDark } = useThemePreference();
  const { textColor, setTextColor } = useTextColorPreference(theme);
  return <SiteNavbar theme={theme} isDark={isDark} textColor={textColor} onThemeChange={setTheme} onTextColorChange={setTextColor} />;
}

it.each(["/", "/personal/", "/projects/example/"])("marks the appropriate navigation destination on %s", (pathname) => {
  route.pathname = pathname;
  render(<Preferences />);
  const links = within(screen.getByRole("navigation")).getAllByRole("link");
  expect(links.filter((link) => link.getAttribute("aria-current") === "page")).toHaveLength(1);
  expect(links.find((link) => link.getAttribute("aria-current") === "page")).toHaveAttribute("href", pathname.includes("personal") ? "/personal" : "/");
});

it("switches themes through the visible control", async () => {
  const user = userEvent.setup();
  render(<Preferences />);
  await user.click(screen.getByRole("button", { name: /switch to dark/i }));
  expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  await user.click(screen.getByRole("button", { name: /switch to light/i }));
  expect(document.documentElement).toHaveAttribute("data-theme", "light");
});

it("supports keyboard navigation, selection, and focus restoration in the palette", async () => {
  const user = userEvent.setup();
  render(<Preferences />);
  const trigger = screen.getByRole("button", { name: /color palette/i });
  await user.click(trigger);
  const options = screen.getAllByRole("menuitemradio");
  expect(options[0]).toHaveFocus();
  await user.keyboard("{ArrowUp}");
  expect(options.at(-1)).toHaveFocus();
  await user.keyboard("{ArrowDown}");
  expect(options[0]).toHaveFocus();
  await user.keyboard("{End}");
  expect(options.at(-1)).toHaveFocus();
  await user.keyboard("{Home}{ArrowDown}{Enter}");
  expect(trigger).toHaveFocus();
  expect(trigger).toHaveAttribute("aria-expanded", "false");
  expect(localStorage.getItem("text-color")).not.toBe("default");
  await user.click(trigger);
  expect(screen.getByRole("menuitemradio", { checked: true })).toHaveFocus();
  await user.keyboard("{Escape}");
  expect(trigger).toHaveFocus();
  expect(screen.queryByRole("menu")).not.toBeInTheDocument();
});

it("dismisses the palette when clicking outside or tabbing away", async () => {
  const user = userEvent.setup();
  render(<><Preferences /><button>Outside</button></>);
  const trigger = screen.getByRole("button", { name: /color palette/i });
  await user.click(trigger);
  await user.click(screen.getByRole("button", { name: "Outside" }));
  expect(trigger).toHaveAttribute("aria-expanded", "false");
  await user.click(trigger);
  await user.keyboard("{End}{Tab}");
  expect(screen.getByRole("button", { name: "Outside" })).toHaveFocus();
  expect(trigger).toHaveAttribute("aria-expanded", "false");
});
