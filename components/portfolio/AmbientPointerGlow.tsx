"use client";

import { useEffect, useRef } from "react";

export function AmbientPointerGlow() {
  const glowRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const latestPointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const glowElement = glowRef.current;
    if (!glowElement) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");

    if (prefersReducedMotion.matches || !canHover.matches) return;

    const syncGlowPosition = () => {
      frameRef.current = null;
      glowElement.style.setProperty("--pointer-x", `${latestPointerRef.current.x}px`);
      glowElement.style.setProperty("--pointer-y", `${latestPointerRef.current.y}px`);
    };

    const onPointerMove = (event: PointerEvent) => {
      latestPointerRef.current = {
        x: event.clientX,
        y: event.clientY
      };

      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(syncGlowPosition);
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="portfolio-pointer-glow"
      aria-hidden="true"
    />
  );
}
