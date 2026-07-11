import { useRef } from "react";

export function useDragClick(callback: () => void) {
  const pos = useRef({ x: 0, y: 0 });

  const onPointerDown = (e: React.PointerEvent) => {
    pos.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const dx = Math.abs(e.clientX - pos.current.x);
    const dy = Math.abs(e.clientY - pos.current.y);

    if (dx < 5 && dy < 5) {
      callback();
    }
  };

  return { onPointerDown, onPointerUp };
}
