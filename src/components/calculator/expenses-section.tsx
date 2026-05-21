"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMonthlyExpensesStore } from "@/stores/monthly-expenses-store";
import { useSalaryStore } from "@/stores/salary-store";
import { Home, Coffee, CreditCard } from "lucide-react";

export function ExpensesSection() {
  const { expenses, setExpense } = useMonthlyExpensesStore();
  const salarioNeto = useSalaryStore((s) => s.result?.salarioNeto ?? 0);

  const totalGastos = Object.values(expenses).reduce(
    (sum, v) => sum + (v || 0),
    0,
  );
  const sobrante = Math.max(0, salarioNeto - totalGastos);
  const formatoDinero = (val: number) => `$${val.toFixed(2)}`;

  return (
    <div className="bg-card rounded-3xl flex flex-col h-full shadow-sm border border-border/50 overflow-hidden">
      {/* Cabecera */}
      <div className="p-6 pb-4 border-b border-border/40 bg-muted/20">
        <h3 className="text-xl font-bold tracking-tight">Tu Realidad</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Ingresa tus gastos para ver cuánto te queda libre.
        </p>
      </div>

      {/* Cuerpo con Inputs */}
      <div className="p-6 space-y-6 flex-grow">
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Home className="w-4 h-4 text-muted-foreground" />
            Gastos Fijos{" "}
            <span className="font-normal text-muted-foreground">
              (Renta, Súper, Luz)
            </span>
          </Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
              $
            </span>
            <Input
              type="number"
              placeholder="0.00"
              className="h-12 pl-8 rounded-xl bg-muted/40 border-transparent focus:bg-background transition-colors text-base"
              value={expenses.fijos || ""}
              onChange={(e) => setExpense("fijos", Number(e.target.value))}
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Coffee className="w-4 h-4 text-muted-foreground" />
            Gastos Variables{" "}
            <span className="font-normal text-muted-foreground">
              (Salidas, Gustos)
            </span>
          </Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
              $
            </span>
            <Input
              type="number"
              placeholder="0.00"
              className="h-12 pl-8 rounded-xl bg-muted/40 border-transparent focus:bg-background transition-colors text-base"
              value={expenses.variables || ""}
              onChange={(e) => setExpense("variables", Number(e.target.value))}
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-muted-foreground" />
            Pago de deudas o créditos
          </Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
              $
            </span>
            <Input
              type="number"
              placeholder="800.00"
              className="h-12 pl-8 rounded-xl bg-muted/40 border-transparent focus:bg-background transition-colors text-base"
              value={expenses.deudas || ""}
              onChange={(e) => setExpense("deudas", Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* Resumen Final Destacado */}
      <div className="p-6 bg-muted/30 border-t border-border/50">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Total Gastos
          </span>
          <span className="font-medium text-destructive tabular-nums">
            {formatoDinero(totalGastos)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">Lo que te sobra</span>
          <span
            className={`text-2xl font-extrabold tabular-nums tracking-tight ${
              sobrante > 0 ? "text-[#1D9E75]" : "text-muted-foreground"
            }`}
          >
            {formatoDinero(sobrante)}
          </span>
        </div>
      </div>
    </div>
  );
}
