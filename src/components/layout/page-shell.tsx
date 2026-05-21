"use client";

import { usePathname } from "next/navigation";
import { AppHeader } from "./app-header";
import { AppNav } from "./app-nav";
import { CalculatorShell } from "./calculator-shell";

export function PageShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (isHome) {
    return <CalculatorShell>{children}</CalculatorShell>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <div className="mx-auto flex w-full max-w-6xl flex-1">
        <AppNav />
        <main className="flex-1 px-4 py-6 pb-24 lg:pb-6">{children}</main>
      </div>
    </div>
  );
}
