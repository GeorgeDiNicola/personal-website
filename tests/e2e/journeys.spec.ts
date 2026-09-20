import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "./fixtures";

const routes = ["/", "/personal/", "/projects/jeopardy/", "/projects/radio-antenna/", "/data-visualizations/"];

for (const path of routes) {
  test(`direct load and reload work for ${path} @smoke`, async ({ page, browserName }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("navigation")).toBeVisible();
    // This refresh test starts from a fully loaded page. In WebKit, reloading
    // mid-prefetch reports unload cancellations as misleading access errors.
    // All external traffic is fulfilled locally, so this wait is bounded.
    await page.waitForLoadState("networkidle");
    await page.reload();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    // macOS WebKit uses Option+Tab to include links in keyboard navigation.
    await page.keyboard.press(browserName === "webkit" && process.platform === "darwin" ? "Alt+Tab" : "Tab");
    const skip = page.getByRole("link", { name: /skip to content/i });
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#main-content")).toBeFocused();
  });

  test(`accessible content in both themes on ${path}`, async ({ page }) => {
    await page.goto(path);
    for (const theme of ["light", "dark"] as const) {
      await page.emulateMedia({ colorScheme: theme });
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      if (path.includes("jeopardy")) await expect(page.getByRole("group", { name: /prediction history/i })).toBeVisible();
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      expect(results.violations.map(({ id, nodes }) => ({ id, elements: nodes.map((node) => node.target) }))).toEqual([]);
    }
  });
}

test("preferences persist through navigation, reload and browser history @smoke", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await page.getByRole("button", { name: /switch to dark/i }).click();
  await page.getByRole("button", { name: /color palette/i }).click();
  const options = page.getByRole("menuitemradio");
  await options.nth(1).click();
  const selectedColor = await page.evaluate(() => localStorage.getItem("text-color"));
  await page.getByRole("navigation").getByRole("link", { name: /personal/i }).click();
  await expect(page).toHaveURL(/\/personal\/?$/);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  expect(await page.evaluate(() => localStorage.getItem("text-color"))).toBe(selectedColor);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await page.goForward();
  await expect(page).toHaveURL(/\/personal\/?$/);
  await page.getByRole("button", { name: /color palette/i }).click();
  await expect(page.getByRole("menuitemradio", { checked: true })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: /color palette/i })).toBeFocused();
});

test("project links lead to usable detail pages and return to projects", async ({ page }) => {
  await page.goto("/#projects");
  const links = await page.locator("#projects a[href^='/']").evaluateAll((elements) => elements.map((element) => element.getAttribute("href")!));
  expect(links.length).toBeGreaterThan(0);
  for (const href of links) {
    await page.locator("#projects").locator(`a[href=${JSON.stringify(href)}]`).click();
    await expect(page).toHaveURL(new URL(href, "http://127.0.0.1:4173").href);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.getByRole("link", { name: /back to projects/i }).click();
    await expect(page).toHaveURL(/\/#projects$/);
    await expect(page.locator("#projects")).toBeInViewport();
  }
});

test("lightbox traps focus and returns it to the gallery @smoke", async ({ page }) => {
  await page.goto("/personal/");
  const opener = page.getByRole("button", { name: /open larger photo/i });
  await opener.click();
  const dialog = page.getByRole("dialog");
  const close = dialog.getByRole("button", { name: /close/i });
  await expect(close).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(dialog.getByRole("button").last()).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();
  expect(await page.locator("main").evaluate((element) => (element as HTMLElement).inert)).toBe(true);
  const image = dialog.getByRole("img").first();
  const initial = await image.getAttribute("src");
  await page.keyboard.press("ArrowRight");
  await expect(image).not.toHaveAttribute("src", initial!);
  await page.keyboard.press("ArrowLeft");
  await expect(image).toHaveAttribute("src", initial!);
  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
  expect(await page.locator("main").evaluate((element) => (element as HTMLElement).inert)).toBe(false);
});

test("prediction errors can be retried without navigating away", async ({ page, expectedHttpErrors }) => {
  let fail = true;
  await page.route("https://www.kaggle.com/**", async (route) => {
    if (fail) {
      expectedHttpErrors.push(route.request().url());
      await route.fulfill({ status: 503, body: "Unavailable" });
    }
    else await route.fallback();
  });
  await page.goto("/projects/jeopardy/");
  const retry = page.getByRole("button", { name: /try again/i });
  await expect(retry).toBeVisible();
  fail = false;
  await retry.click();
  const history = page.getByRole("group", { name: /prediction history/i });
  await expect(history).toBeVisible();
  const choice = history.getByRole("button").first();
  await choice.click();
  await expect(choice).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(`#${await choice.getAttribute("aria-controls")}`)).toContainText("Alex One");
});

test("dashboards offer usable destinations on small screens", async ({ page }) => {
  await page.goto("/data-visualizations/");
  const mobile = page.viewportSize()!.width < 1024;
  const links = page.getByRole("link", { name: /open dashboard/i, includeHidden: true });
  const frames = page.locator("iframe[src*='tableau']");
  await expect.poll(() => links.count()).toBeGreaterThan(0);
  await expect.poll(() => frames.count()).toBeGreaterThan(0);
  for (const link of await links.all()) {
    if (mobile) await expect(link).toBeVisible();
    else await expect(link).toBeHidden();
  }
  for (const frame of await frames.all()) {
    if (mobile) await expect(frame).toBeHidden();
    else await expect(frame).toBeVisible();
  }
});

test("back-to-top returns the visitor to the beginning", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.getByRole("button", { name: /back to top/i }).click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await expect(page.getByRole("navigation")).toBeInViewport();
});

test("preferences synchronize between open tabs", async ({ page, context }) => {
  await page.goto("/");
  const otherTab = await context.newPage();
  await otherTab.goto("/personal/");
  await page.getByRole("button", { name: /switch to dark/i }).click();
  await expect(otherTab.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: /color palette/i }).click();
  await page.getByRole("menuitemradio").nth(1).click();
  await otherTab.getByRole("button", { name: /color palette/i }).click();
  const selectedName = await otherTab.getByRole("menuitemradio", { checked: true }).getAttribute("aria-label");
  await page.getByRole("button", { name: /color palette/i }).click();
  await expect(page.getByRole("menuitemradio", { checked: true })).toHaveAttribute("aria-label", selectedName!);
});

test("the navbar returns when scrolling up and remains usable with the palette open", async ({ page }) => {
  await page.goto("/");
  // Confirm hydration through an observable action before issuing a scroll.
  await page.getByRole("button", { name: /switch to dark/i }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  const navigation = page.getByRole("navigation");
  await page.evaluate(() => window.scrollTo(0, 900));
  await expect(navigation).not.toBeInViewport();
  await page.evaluate(() => window.scrollTo(0, 500));
  await expect(navigation).toBeInViewport();
  await page.getByRole("button", { name: /color palette/i }).click();
  await page.evaluate(() => window.scrollTo(0, 1200));
  await expect(page.getByRole("menu")).toBeInViewport();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: /color palette/i })).toBeFocused();
});

test("the introduction yields to visitor input and respects reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.locator("html")).not.toHaveAttribute("data-home-intro");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await expect(page.locator("html")).not.toHaveAttribute("data-home-intro");
});
