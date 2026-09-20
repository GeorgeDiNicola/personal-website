# Website testing

Use Node 24.15+ (or Node 26) and pnpm 10. CI uses the latest Node 24 release. Install dependencies and browser engines once:

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium firefox webkit
```

On Linux, use `pnpm exec playwright install --with-deps chromium firefox webkit` to install browser system libraries too.

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm test` | Run component and logic tests once |
| `pnpm test:watch` | Rerun affected tests during development |
| `pnpm test:coverage` | Check coverage thresholds and write HTML/LCOV reports |
| `pnpm typecheck` | Check application and test TypeScript |
| `pnpm test:e2e` | Build the production static export and run browser tests |
| `pnpm test:e2e:run` | Run browser tests against the existing `out/` build |
| `pnpm test:e2e:ui` | Explore browser tests interactively against the existing build |
| `pnpm exec playwright show-report` | Open the latest browser report |

Focused runs:

```sh
pnpm test components/personal/OutdoorPhotographySection.test.tsx
pnpm test:e2e:run --project=chromium --grep lightbox
```

The browser runner starts and stops its own static server on `127.0.0.1:4173`. It deliberately does not reuse a running server, avoiding accidental tests against stale code. Use `test:e2e` after changing application code; the shorter `test:e2e:run` is for test-only iteration.

`test:build` generates local photo metadata and runs `next build` directly. It uses the committed Open Library manifest, avoiding the live data refresh in the regular `prebuild` script. Next's existing Google Fonts integration still requires network access during a fresh build. Browser fixtures intercept external resources; the browser tests themselves do not depend on provider uptime. The browser configuration targets the default root deployment; the return-link unit tests also cover a configured base path.

## What the suite protects

- Vitest and Testing Library exercise preferences, storage/media events, palette keyboard controls, gallery/lightbox behavior, chess messages, book pagination and covers, prediction requests and real XLSX parsing, motion behavior, and page composition.
- Playwright tests the actual exported pages and assets, navigation/history, persistent and cross-tab preferences, keyboard focus, modal isolation, scrolling, responsive dashboards, prediction recovery, and console/hydration errors.
- Chromium and mobile WebKit run the full journeys. Firefox and desktop WebKit run journeys marked `@smoke`. Mobile emulation does not replace physical-device testing.
- Axe checks WCAG A/AA rules on each route in both themes, plus the open lightbox. Automated accessibility checks supplement manual review.

Coverage includes **all** TypeScript/TSX application files under `app/` and `components/`, including unimported files. Tests and type-only declarations are excluded. Global minimums are 90% statements, 90% lines, 90% functions, and 80% branches. Open `coverage/index.html` for gaps. Browser coverage is not merged into these figures; for example, the root layout and pre-hydration scripts receive real-browser validation without inflating the Vitest numbers.

## Keeping tests useful as the design evolves

Assert what a visitor can do and observe. Prefer accessible roles/names and fixture data. Test names, destinations, and outcomes that form an interaction contract, not full paragraphs, the live number of books/projects, section order, CSS class strings, or exact spacing.

Use component fixtures to exercise edge cases. Keep Next components and application components real whenever possible. The shared jsdom setup supplies media events, a non-layout intersection observer, and a scrolling stub; real scrolling, CSS visibility, and focus isolation belong in browser tests. The back-to-top component test controls Framer Motion's scroll input without replacing the rendered component.

Do not add arbitrary sleeps or broad console-error suppression. Playwright waits for observable conditions. A failed-request test explicitly permits only a 503 resource error for the exact mocked endpoint; all other browser errors still fail. Third-party iframe internals are replaced with fixtures: we test our embed configuration and fallbacks, not Chess.com/Tableau/Flourish functionality.

There are no pixel screenshot baselines. Screenshots and traces are collected on failure for diagnosis, allowing copy and visual design to evolve. If an intended interaction changes, update its focused tests alongside the implementation. Do not bless a bug just to make a test pass.

## CI and manual review

The `Website tests` workflow runs on pull requests and can run manually. The deployment workflow calls it and waits for success before its existing build/deployment steps. CI uploads coverage, the Playwright HTML report, and failure traces/screenshots for 14 days. Browser retries are limited to one in CI; inspect retry reports rather than treating a flaky pass as healthy.

Before shipping a significant UX change, manually verify:

- Screen-reader reading order, palette announcements, and prediction updates.
- Actual iPhone touch gestures, browser chrome, scrolling, and lightbox dismissal.
- Keyboard focus visibility, zoom/reflow, and readable colors throughout both themes and the text palette.
- Motion comfort with reduced motion enabled and disabled.
- Live external services separately when changing their integration contracts.

The return-to-projects browser journey starts from a fragment URL intentionally. It protects a regression where Next's cached route duplicated `#projects` on the return trip. The shared native return link preserves the intended fragment and supports deployment base paths.
