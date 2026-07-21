import { useRef } from "react";

export default function useSwipe({ onSwipeLeft, onSwipeRight, threshold = 64 } = {}) {
  const start = useRef(null);

  return {
    onTouchStart: (event) => {
      const touch = event.touches[0];
      start.current = { x: touch.clientX, y: touch.clientY };
    },
    onTouchEnd: (event) => {
      if (!start.current) return;
      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - start.current.x;
      const deltaY = touch.clientY - start.current.y;
      start.current = null;

      if (Math.abs(deltaX) < threshold || Math.abs(deltaX) <= Math.abs(deltaY)) return;
      if (deltaX > 0) onSwipeRight?.();
      else onSwipeLeft?.();
    },
    onTouchCancel: () => {
      start.current = null;
    },
  };
}
