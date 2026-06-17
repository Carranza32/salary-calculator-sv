"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

function Slider({
  className,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const displayVal = props.value?.[0] ?? props.defaultValue?.[0] ?? 200;
  const formattedVal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(displayVal);

  return (
    <SliderPrimitive.Root
      className={cn(
        "relative flex w-full touch-none select-none items-center py-2",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-3 w-full grow overflow-hidden rounded-full bg-secondary">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="relative block h-11 w-11 rounded-full border-2 border-primary bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 sm:h-6 sm:w-6 group cursor-grab active:cursor-grabbing flex items-center justify-center">
        {/* Tooltip bubble */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 active:opacity-100 transition-opacity duration-200 pointer-events-none z-30 flex flex-col items-center">
          <div className="bg-popover text-popover-foreground text-[11px] font-bold px-2 py-1 rounded-lg border border-border shadow-lg whitespace-nowrap">
            {formattedVal}
          </div>
          <div className="w-1.5 h-1.5 bg-popover border-r border-b border-border rotate-45 -mt-1" />
        </div>
      </SliderPrimitive.Thumb>
    </SliderPrimitive.Root>
  );
}

export { Slider };
