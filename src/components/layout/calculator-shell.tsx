"use client";

import { ThemeToggle } from "@/components/theme/theme-toggle";

export function CalculatorShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="fixed top-3 right-4 z-50 flex items-center gap-2">
        {/* <ThemeAccentPicker /> */}
        <ThemeToggle />
      </div>
      <main className="flex-1 py-8">{children}</main>
    </div>
  );
}
