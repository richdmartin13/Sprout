import { useRef, useCallback } from 'react';

// 600 ms hold, cancels if moved > 10 px. Suppresses subsequent click.
export function useLongPress(onLongPress, { delay = 600, moveTolerance = 10 } = {}) {
  const timer = useRef(null);
  const start = useRef({ x: 0, y: 0 });
  const triggered = useRef(false);

  const cancel = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const onPointerDown = useCallback((e) => {
    triggered.current = false;
    const p = pointPos(e);
    start.current = p;
    cancel();
    timer.current = setTimeout(() => {
      triggered.current = true;
      onLongPress(e, p);
    }, delay);
  }, [onLongPress, delay, cancel]);

  const onPointerMove = useCallback((e) => {
    if (!timer.current) return;
    const p = pointPos(e);
    if (Math.abs(p.x - start.current.x) > moveTolerance || Math.abs(p.y - start.current.y) > moveTolerance) {
      cancel();
    }
  }, [moveTolerance, cancel]);

  const onPointerUp = useCallback(() => {
    cancel();
  }, [cancel]);

  const onClick = useCallback((e) => {
    if (triggered.current) {
      triggered.current = false;
      e.stopPropagation();
      e.preventDefault();
    }
  }, []);

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel: onPointerUp,
    onPointerLeave: onPointerUp,
    onClickCapture: onClick,
  };
}

function pointPos(e) {
  if (e.touches && e.touches[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  return { x: e.clientX || 0, y: e.clientY || 0 };
}
