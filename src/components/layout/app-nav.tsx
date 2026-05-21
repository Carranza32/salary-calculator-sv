"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, History, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Calculadora", icon: Calculator },
  { href: "/presupuesto", label: "Presupuesto", icon: Wallet },
  { href: "/historial", label: "Historial", icon: History },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <>
      <nav
        className="hidden lg:flex lg:w-56 lg:flex-col lg:gap-1 lg:border-r lg:p-4"
        aria-label="Navegación principal"
      >
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </nav>

      <nav
        className="fixed inset-x-0 bottom-0 z-50 flex border-t bg-background/95 backdrop-blur lg:hidden"
        aria-label="Navegación móvil"
      >
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
