"use client";

import { ThemeAccentPicker } from "@/components/theme/theme-accent-picker";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            El Salvador · 2025
          </p>
          <h1 className="text-lg font-bold text-foreground">
            Calculadora Salarial SV
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <ThemeAccentPicker />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
