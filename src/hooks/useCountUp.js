import { useEffect, useRef, useState } from 'react';

/**
 * Animate a number from 0 (or `from`) to `end` over `duration` ms.
 * Uses requestAnimationFrame with an ease-out curve.
 */
export function useCountUp(end, { duration = 1200, from = 0, decimals = 0 } = {}) {
  const [value, setValue] = useState(from);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    if (end === null || end === undefined || isNaN(end)) return;
    startRef.current = null;
    cancelAnimationFrame(rafRef.current);

    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const tick = (now) => {
      if (!startRef.current) startRef.current = now;
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const current = from + (end - from) * easeOut(progress);
      setValue(Number(current.toFixed(decimals)));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [end, duration, from, decimals]);

  return value;
}
