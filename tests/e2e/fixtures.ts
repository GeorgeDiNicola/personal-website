import { test as base, expect, type Page } from "@playwright/test";
import { photos } from "../fixtures/photos";
import { predictionWorkbook } from "../fixtures/predictions";

const placeholder = '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="800" height="600" fill="#667788"/></svg>';

export const test = base.extend<{ browserChecks: void; expectedHttpErrors: string[] }>({
  expectedHttpErrors: async ({}, provide) => { await provide([]); },
  browserChecks: [async ({ page, context, expectedHttpErrors }, provide) => {
    const errors: string[] = [];
    const collectErrors = (tab: Page) => {
      tab.on("pageerror", (error) => errors.push(error.message));
      tab.on("console", (message) => {
        // Failure/recovery tests opt into their exact endpoint's HTTP error only.
        if (expectedHttpErrors.includes(message.location().url) && /Failed to load resource.*503/i.test(message.text())) return;
        if (message.type() === "error" || /hydration|did not match/i.test(message.text())) errors.push(message.text());
      });
    };
    collectErrors(page);
    context.on("page", collectErrors);
    // Leave Next.js navigation/prefetch traffic untouched, including cancellations.
    await context.route((url) => url.hostname !== "127.0.0.1"
      || url.pathname.endsWith("/images/outdoor-photography/manifest.json")
      || url.pathname.startsWith("/test-photo-"), async (route) => {
      const request = route.request();
      const url = new URL(request.url());
      if (url.pathname.endsWith("/images/outdoor-photography/manifest.json")) {
        await route.fulfill({ json: photos });
      } else if (url.hostname === "www.kaggle.com") {
        await route.fulfill({ contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", body: predictionWorkbook() });
      } else if (url.pathname.startsWith("/test-photo-") || (request.resourceType() === "image" && url.hostname !== "127.0.0.1")) {
        await route.fulfill({ contentType: "image/svg+xml", body: placeholder });
      } else if (url.hostname !== "127.0.0.1") {
        await route.fulfill({ contentType: "text/html", body: "<!doctype html><html lang='en'><title>Fixture embed</title><body>External content fixture</body></html>" });
      } else {
        await route.continue();
      }
    });
    await provide();
    expect(errors, "Unexpected browser errors or hydration warnings").toEqual([]);
  }, { auto: true }],
});

export { expect };
