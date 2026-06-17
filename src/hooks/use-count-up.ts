"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

/**
 * Animates a numeric value using GSAP and writes the formatted result
 * into a DOM element ref. Designed for currency/number displays.
 *
 * @param targetRef  - ref to the element whose textContent we update
 * @param value      - the new target number
 * @param format     - formatter function (e.g. formatCurrency)
 * @param duration   - animation duration in seconds (default 0.45)
 */
export function useCountUp(
  targetRef: React.RefObject<HTMLElement | null>,
  value: number,
  format: (n: number) => string,
  duration = 0.45
) {
  const prevRef = useRef<number>(value);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    // Kill any in-progress animation
    tweenRef.current?.kill();

    const obj = { val: prevRef.current };

    tweenRef.current = gsap.to(obj, {
      val: value,
      duration,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = format(obj.val);
      },
      onComplete: () => {
        prevRef.current = value;
      },
    });

    return () => {
      tweenRef.current?.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
}
