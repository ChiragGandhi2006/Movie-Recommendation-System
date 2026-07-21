import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ROOT_ROUTES = new Set(["/", "/home"]);
const INTERACTIVE_SELECTOR = "input, textarea, select, button, [contenteditable='true'], [data-disable-swipe-back]";

export default function SwipeBackNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const start = useRef(null);

  useEffect(() => {
    const onTouchStart = (event) => {
      if (event.touches.length !== 1 || event.target.closest(INTERACTIVE_SELECTOR)) return;
      const touch = event.touches[0];
      start.current = { x: touch.clientX, y: touch.clientY };
    };
    const onTouchEnd = (event) => {
      if (!start.current) return;
      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - start.current.x;
      const deltaY = touch.clientY - start.current.y;
      start.current = null;
      if (deltaX > -72 || Math.abs(deltaX) <= Math.abs(deltaY) || ROOT_ROUTES.has(location.pathname)) return;
      // React Router keeps its in-app position in history.state.idx. Using it
      // avoids navigating away from MovieVerse when a page was opened directly.
      if ((window.history.state?.idx ?? 0) > 0) navigate(-1);
      else navigate("/home", { replace: true });
    };
    const reset = () => { start.current = null; };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", reset, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", reset);
    };
  }, [location.pathname, navigate]);

  return null;
}
