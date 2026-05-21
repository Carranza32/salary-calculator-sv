"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
  className,
}: CollapsibleSectionProps) {
  return (
    <details
      className={cn("group rounded-2xl border bg-card", className)}
      open={defaultOpen}
    >
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 py-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
        <span>{title}</span>
        <ChevronDown
          className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
          aria-hidden
        />
      </summary>
      <div className="border-t px-4 pb-4">{children}</div>
    </details>
  );
}
