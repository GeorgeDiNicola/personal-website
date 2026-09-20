import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { photos } from "@/tests/fixtures/photos";
import { OutdoorPhotographySection } from "./OutdoorPhotographySection";

function mount(payload: unknown = photos, isDark = false) {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => payload }));
  return render(<main><OutdoorPhotographySection isDark={isDark} /></main>);
}

function activePhoto() {
  return within(screen.getByRole("button", { name: /open larger photo/i })).getByRole("img");
}

it.each([false, true])("navigates and wraps photos with buttons, thumbnails and keyboard (dark=%s)", async (dark) => {
  const user = userEvent.setup();
  mount(photos, dark);
  await screen.findByRole("button", { name: /open larger photo/i });
  expect(activePhoto()).toHaveAttribute("alt", photos[0].alt);
  await user.click(screen.getByRole("button", { name: /previous photo/i }));
  expect(activePhoto()).toHaveAttribute("alt", photos.at(-1)?.alt);
  await user.click(screen.getByRole("button", { name: /next photo/i }));
  expect(activePhoto()).toHaveAttribute("alt", photos[0].alt);
  await user.click(screen.getByRole("button", { name: "View photo 2" }));
  expect(activePhoto()).toHaveAttribute("alt", photos[1].alt);
  await user.keyboard("{ArrowRight}");
  expect(activePhoto()).toHaveAttribute("alt", photos[2].alt);
  await user.keyboard("{ArrowLeft}");
  expect(activePhoto()).toHaveAttribute("alt", photos[1].alt);
});

it("keeps lightbox interaction contained and restores the page on close", async () => {
  const user = userEvent.setup();
  mount();
  const opener = await screen.findByRole("button", { name: /open larger photo/i });
  const page = screen.getByRole("main");
  document.body.style.overflow = "auto";
  await user.click(opener);
  const dialog = screen.getByRole("dialog");
  const close = within(dialog).getByRole("button", { name: /close/i });
  await waitFor(() => expect(close).toHaveFocus());
  expect(page.inert).toBe(true);
  expect(page).toHaveAttribute("aria-hidden", "true");
  expect(document.body.style.overflow).toBe("hidden");
  await user.tab({ shift: true });
  expect(within(dialog).getAllByRole("button").at(-1)).toHaveFocus();
  await user.tab();
  expect(close).toHaveFocus();
  await user.keyboard("{ArrowRight}{ArrowLeft}");
  await user.click(within(dialog).getByRole("button", { name: /next photo/i }));
  await user.click(within(dialog).getByRole("button", { name: /previous photo/i }));
  await user.click(within(dialog).getByRole("button", { name: "View photo 3" }));
  const image = within(dialog).getAllByRole("img")[0];
  expect(image).toHaveAttribute("alt", photos[2].alt);
  await user.click(image);
  expect(dialog).toBeInTheDocument();
  await user.keyboard("{Escape}");
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(page.inert).toBe(false);
  expect(page).not.toHaveAttribute("aria-hidden");
  expect(document.body.style.overflow).toBe("auto");
  expect(opener).toHaveFocus();
  expect(activePhoto()).toHaveAttribute("alt", photos[2].alt);
});

it.each(["button", "backdrop", "unmount"])("cleans up the lightbox through %s", async (method) => {
  const user = userEvent.setup();
  const { unmount } = mount();
  await user.click(await screen.findByRole("button", { name: /open larger photo/i }));
  if (method === "unmount") unmount();
  else if (method === "button") await user.click(screen.getByRole("button", { name: /close expanded/i }));
  else await user.click(screen.getByRole("dialog"));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(document.body.style.overflow).toBe("");
});

it("responds to horizontal swipes while ignoring short or vertical gestures", async () => {
  const user = userEvent.setup();
  mount();
  await user.click(await screen.findByRole("button", { name: /open larger photo/i }));
  const image = within(screen.getByRole("dialog")).getAllByRole("img")[0];
  const swipe = (x: number, y: number) => {
    fireEvent.touchStart(image, { touches: [{ clientX: 200, clientY: 200 }] });
    fireEvent.touchEnd(image, { changedTouches: [{ clientX: x, clientY: y }] });
  };
  swipe(190, 200);
  swipe(100, 400);
  expect(image).toHaveAttribute("alt", photos[0].alt);
  swipe(80, 200);
  expect(image).toHaveAttribute("alt", photos[1].alt);
  swipe(320, 200);
  expect(image).toHaveAttribute("alt", photos[0].alt);
  fireEvent.touchStart(image, { touches: [] });
  fireEvent.touchEnd(image, { changedTouches: [] });
  expect(image).toHaveAttribute("alt", photos[0].alt);
});

it.each([[], {}, [null, {}, { ...photos[0], width: 0 }]])("handles unusable manifests without interactive controls: %j", async (payload) => {
  mount(payload);
  await waitFor(() => expect(screen.queryByText(/loading photos/i)).not.toBeInTheDocument());
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
  expect(screen.getByRole("main")).not.toBeEmptyDOMElement();
});

it("filters malformed entries while keeping valid photos", async () => {
  mount([null, { ...photos[0], height: NaN }, photos[1]]);
  await screen.findByRole("button", { name: /open larger photo/i });
  expect(activePhoto()).toHaveAttribute("alt", photos[1].alt);
  expect(screen.getAllByRole("button", { name: /view photo/i })).toHaveLength(1);
});

it.each(["network", "http", "json"])("settles gracefully after a %s failure", async (failure) => {
  const fetch = vi.fn();
  vi.stubGlobal("fetch", fetch);
  if (failure === "network") fetch.mockRejectedValue(new Error("offline"));
  else fetch.mockResolvedValue({ ok: failure !== "http", json: async () => { throw new Error("invalid JSON"); } });
  render(<OutdoorPhotographySection isDark={false} />);
  await waitFor(() => expect(screen.queryByText(/loading photos/i)).not.toBeInTheDocument());
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});
