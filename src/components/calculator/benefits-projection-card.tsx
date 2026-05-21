"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BenefitsBarChart } from "@/components/charts/benefits-bar-chart";
import { formatCurrency } from "@/lib/format";
import { useSalaryStore } from "@/stores/salary-store";

export function BenefitsProjectionCard() {
  const benefits = useSalaryStore((s) => s.benefits);
  const salary = useSalaryStore((s) => s.salary);

  if (!benefits || salary <= 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Beneficios anuales estimados</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <BenefitsBarChart
          aguinaldo={benefits.aguinaldo}
          vacaciones={benefits.vacaciones}
          indemnizacion={benefits.indemnizacion}
        />
        <div className="grid gap-2 text-sm">
          <div className="flex justify-between">
            <span>Aguinaldo</span>
            <span className="font-medium">{formatCurrency(benefits.aguinaldo)}</span>
          </div>
          <div className="flex justify-between">
            <span>Vacaciones + prima</span>
            <span className="font-medium">{formatCurrency(benefits.vacaciones)}</span>
          </div>
          <div className="flex justify-between">
            <span>Indemnización (estimada)</span>
            <span className="font-medium">{formatCurrency(benefits.indemnizacion)}</span>
          </div>
          <div className="flex justify-between border-t pt-2 font-semibold">
            <span>Total anual</span>
            <span>{formatCurrency(benefits.total)}</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Estimaciones según Código de Trabajo de El Salvador. Consulte un abogado
          laboral para casos específicos.
        </p>
      </CardContent>
    </Card>
  );
}
