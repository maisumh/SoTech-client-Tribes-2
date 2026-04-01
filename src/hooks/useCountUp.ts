"use client";

import { useEffect, useState, useRef } from "react";

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function useCountUp(
  target: number,
  inView: boolean,
  duration = 2000,
  formatWithCommas = false
): string {
  const [current, setCurrent] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = performance.now();

    function update(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const value = Math.floor(target * easedProgress);
      setCurrent(value);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setCurrent(target);
      }
    }

    requestAnimationFrame(update);
  }, [inView, target, duration]);

  if (formatWithCommas) {
    return current.toLocaleString();
  }
  return current.toString();
}
