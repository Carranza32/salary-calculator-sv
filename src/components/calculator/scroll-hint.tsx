"use client";

import { ChevronDown } from "lucide-react";

export function ScrollHint() {
  return (
    <div
      className="flex flex-col items-center gap-1 pt-2 text-muted-foreground"
      aria-hidden
    >
      <span className="text-xs">Desliza para ver más</span>
      <ChevronDown className="h-5 w-5 animate-bounce" />
    </div>
  );
}
