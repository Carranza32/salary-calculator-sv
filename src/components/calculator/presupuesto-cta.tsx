"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSalaryStore } from "@/stores/salary-store";

export function PresupuestoCTA() {
  const result = useSalaryStore((s) => s.result);
  if (!result || result.salarioNeto <= 0) return null;

  return (
    <Button asChild className="w-full" size="lg">
      <Link href="/presupuesto">
        Ir a Mi Presupuesto
        <ArrowRight className="h-4 w-4" />
      </Link>
    </Button>
  );
}
