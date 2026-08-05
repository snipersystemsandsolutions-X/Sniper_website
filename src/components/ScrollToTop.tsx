import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Instantly resets scroll position on every route change.
 * We use "instant" (not "smooth") here because the page-transition
 * animation already provides a visual cue — smooth-scrolling on top
 * of that creates a jarring double-motion effect.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return null;
}
