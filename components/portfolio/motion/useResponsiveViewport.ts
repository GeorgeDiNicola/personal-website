"use client";

import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT_QUERY = "(max-width: 768px)";
const MOBILE_VIEWPORT_MARGIN = "0px 0px 18% 0px";

export function useResponsiveViewport() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_BREAKPOINT_QUERY);
    const syncIsMobile = () => setIsMobile(mediaQuery.matches);

    syncIsMobile();
    mediaQuery.addEventListener("change", syncIsMobile);

    return () => {
      mediaQuery.removeEventListener("change", syncIsMobile);
    };
  }, []);

  const viewportFor = (desktopAmount: number, mobileAmount = Math.min(desktopAmount, 0.16), once = true) => ({
    once,
    amount: isMobile ? mobileAmount : desktopAmount,
    margin: isMobile ? MOBILE_VIEWPORT_MARGIN : "0px"
  });

  return { isMobile, viewportFor };
}
