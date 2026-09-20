import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { AmbientPointerGlow } from "./AmbientPointerGlow";
import { ParallaxBackground } from "./ParallaxBackground";
import { BackToTopButton } from "./BackToTopButton";
import { installMediaQueries } from "@/tests/helpers/media";

// The library owns scroll measurement; our contract is the response to its values.
const motionState = vi.hoisted(() => ({
  reduced: false,
  onScroll: undefined as ((value: number) => void) | undefined,
}));
vi.mock("framer-motion", async (importOriginal) => ({
  ...await importOriginal<typeof import("framer-motion")>(),
  useReducedMotion: () => motionState.reduced,
  useMotionValueEvent: (_value: unknown, _event: string, callback: (value: number) => void) => {
    motionState.onScroll = callback;
  },
}));

it.each([false, true])("back-to-top only appears after scrolling and honors reduced motion=%s", async (reduced) => {
  motionState.reduced = reduced;
  const user = userEvent.setup();
  const scroll = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  render(<BackToTopButton />);
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
  act(() => motionState.onScroll?.(100));
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
  act(() => motionState.onScroll?.(1000));
  await user.click(screen.getByRole("button", { name: /back to top/i }));
  expect(scroll).toHaveBeenCalledWith({ top: 0, behavior: reduced ? "instant" : "smooth" });
});

it.each([false, true])("decorative parallax stays outside the accessibility tree (reduced=%s)", (reduced) => {
  motionState.reduced = reduced;
  const { container, rerender } = render(<ParallaxBackground isDark={false} />);
  expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  rerender(<ParallaxBackground isDark />);
  expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
});

it("batches pointer movement and stops pending work on unmount", () => {
  installMediaQueries({ "(hover: hover) and (pointer: fine)": true });
  let frame: FrameRequestCallback | undefined;
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => { frame = callback; return 123; });
  const cancel = vi.spyOn(window, "cancelAnimationFrame");
  const { container, unmount } = render(<AmbientPointerGlow />);
  fireEvent.pointerMove(window, { clientX: 100, clientY: 200 });
  fireEvent.pointerMove(window, { clientX: 150, clientY: 250 });
  act(() => frame?.(0));
  const glow = container.firstChild as HTMLElement;
  expect(glow.style.getPropertyValue("--pointer-x")).toBe("150px");
  expect(glow.style.getPropertyValue("--pointer-y")).toBe("250px");
  fireEvent.pointerMove(window, { clientX: 200, clientY: 300 });
  unmount();
  expect(cancel).toHaveBeenCalledWith(123);
});

it.each([true, false])("does not animate pointer effects without an appropriate input mode (reduced=%s)", (reduced) => {
  installMediaQueries({ "(prefers-reduced-motion: reduce)": reduced });
  const request = vi.spyOn(window, "requestAnimationFrame");
  render(<AmbientPointerGlow />);
  fireEvent.pointerMove(window, { clientX: 100, clientY: 200 });
  expect(request).not.toHaveBeenCalled();
});
