"use client";

import { ThemeToggle } from "@/components/theme/theme-toggle";

export function CalculatorShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col relative z-0 bg-background transition-colors duration-300">
      {/* Background ambient glows (Gemini/iOS style) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-500/10 dark:bg-emerald-950/15 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[30%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-indigo-500/5 dark:bg-indigo-950/10 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] left-[20%] w-[55vw] h-[55vw] rounded-full bg-teal-500/5 dark:bg-teal-950/10 blur-[120px] pointer-events-none -z-10" />

      <div className="fixed top-3 right-4 z-50 flex items-center gap-2">
        {/* <ThemeAccentPicker /> */}
        <ThemeToggle />
      </div>
      <main className="flex-1 py-8 z-10">{children}</main>
    </div>
  );
}
