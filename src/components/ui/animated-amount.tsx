"use client";

import { useRef } from "react";
import { formatCurrency } from "@/lib/format";
import { useCountUp } from "@/hooks/use-count-up";

interface AnimatedAmountProps {
  value: number;
  className?: string;
  duration?: number;
  /** Formatter function — defaults to formatCurrency */
  format?: (n: number) => string;
}

/**
 * Drop-in replacement for a currency span that animates
 * from the previous value to the new one using GSAP.
 */
export function AnimatedAmount({
  value,
  className,
  duration = 0.45,
  format = formatCurrency,
}: AnimatedAmountProps) {
  const ref = useRef<HTMLSpanElement>(null);
  useCountUp(ref, value, format, duration);

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}
