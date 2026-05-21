"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/format";
import { useSalaryStore } from "@/stores/salary-store";

export function PatronalContributionsCard() {
  const result = useSalaryStore((s) => s.result);
  if (!result || result.salarioBruto <= 0) return null;

  const liquidoMensual =
    result.salarioBruto + result.deduccionesTotalesPatronales;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aportes patronales</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span>AFP patronal (8.75%)</span>
          <span className="font-medium">{formatCurrency(result.afpPatronal)}</span>
        </div>
        <div className="flex justify-between">
          <div>
            <span>ISSS patronal (7.5%)</span>
            <p className="text-xs text-muted-foreground">Tope máximo $75</p>
          </div>
          <span className="font-medium">{formatCurrency(result.isssPatronal)}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-medium">
          <span>Total patronal</span>
          <span>{formatCurrency(result.deduccionesTotalesPatronales)}</span>
        </div>
        <Separator />
        <div className="flex justify-between">
          <span>Salario líquido mensual (empleador)</span>
          <span className="font-semibold">{formatCurrency(liquidoMensual)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Quincenal</span>
          <span>{formatCurrency(liquidoMensual / 2)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
