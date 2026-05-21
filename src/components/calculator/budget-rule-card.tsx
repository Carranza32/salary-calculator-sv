"use client";

import { PiggyBank, ShoppingBag, Home } from "lucide-react";

interface BudgetRuleCardProps {
  salarioNeto: number;
}

export function BudgetRuleCard({ salarioNeto }: BudgetRuleCardProps) {
  const needs = salarioNeto * 0.5;
  const wants = salarioNeto * 0.3;
  const savings = salarioNeto * 0.2;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val);

  return (
    <div className="bg-card rounded-3xl p-6 shadow-sm border border-border/50">
      <div className="mb-6">
        <h3 className="text-xl font-bold">
          ¿Te alcanza con {formatCurrency(salarioNeto)}?
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          La regla 50/30/20 te ayuda a distribuir tu salario de forma
          inteligente.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
            <Home className="h-4 w-4" />
            <span className="font-semibold text-sm">50% Básico</span>
          </div>
          <span className="text-2xl font-bold">{formatCurrency(needs)}</span>
          <span className="text-xs text-muted-foreground mt-1">
            Vivienda, comida, servicios
          </span>
        </div>

        <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-2">
            <ShoppingBag className="h-4 w-4" />
            <span className="font-semibold text-sm">30% Gustos</span>
          </div>
          <span className="text-2xl font-bold">{formatCurrency(wants)}</span>
          <span className="text-xs text-muted-foreground mt-1">
            Salidas, ropa, Netflix
          </span>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2">
            <PiggyBank className="h-4 w-4" />
            <span className="font-semibold text-sm">20% Futuro</span>
          </div>
          <span className="text-2xl font-bold">{formatCurrency(savings)}</span>
          <span className="text-xs text-muted-foreground mt-1">
            Ahorros y deudas
          </span>
        </div>
      </div>
    </div>
  );
}
