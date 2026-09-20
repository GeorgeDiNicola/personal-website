import { vi } from "vitest";

/** An event-capable matchMedia fake, so preference changes exercise subscriptions. */
export function installMediaQueries(initial: Record<string, boolean> = {}) {
  const queries = new Map<string, MediaQueryList>();
  vi.stubGlobal("matchMedia", (query: string): MediaQueryList => {
    let media = queries.get(query);
    if (!media) {
      const target = new EventTarget();
      media = Object.assign(target, {
        matches: initial[query] ?? false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
      }) as MediaQueryList;
      queries.set(query, media);
    }
    return media;
  });
  return (query: string, matches: boolean): void => {
    const media = window.matchMedia(query);
    Object.defineProperty(media, "matches", { value: matches, configurable: true });
    media.dispatchEvent(new Event("change"));
  };
}
