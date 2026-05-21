"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AFP_ENTIDADES } from "@/lib/salary/constants";
import type { TenureKey } from "@/lib/salary/types";
import { useSalaryStore } from "@/stores/salary-store";

const TENURE_OPTIONS: { value: TenureKey; label: string }[] = [
  { value: "menos_1", label: "Menos de 1 año" },
  { value: "1_3", label: "1-3 años" },
  { value: "3_10", label: "3-10 años" },
  { value: "mas_10", label: "Más de 10 años" },
];

export function SalaryInputCard() {
  const salary = useSalaryStore((s) => s.salary);
  const afpEntity = useSalaryStore((s) => s.afpEntity);
  const tenure = useSalaryStore((s) => s.tenure);
  const setSalary = useSalaryStore((s) => s.setSalary);
  const setAfpEntity = useSalaryStore((s) => s.setAfpEntity);
  const setTenure = useSalaryStore((s) => s.setTenure);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Salario bruto mensual</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="salary">Monto en USD</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="salary"
                type="number"
                min={0}
                step={0.01}
                className="pl-7"
                value={salary || ""}
                onChange={(e) => setSalary(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSalary(0)}
              aria-label="Limpiar salario"
            >
              Limpiar
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Entidad AFP (informativo)</Label>
          <ToggleGroup
            type="single"
            value={afpEntity}
            onValueChange={(v) => v && setAfpEntity(v)}
          >
            {AFP_ENTIDADES.map((entity) => (
              <ToggleGroupItem key={entity} value={entity} aria-label={entity}>
                {entity}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="space-y-2">
          <Label>Antigüedad laboral</Label>
          <ToggleGroup
            type="single"
            value={tenure}
            onValueChange={(v) => v && setTenure(v as TenureKey)}
            className="flex-col items-stretch sm:flex-row sm:flex-wrap"
          >
            {TENURE_OPTIONS.map((opt) => (
              <ToggleGroupItem
                key={opt.value}
                value={opt.value}
                className="justify-center"
              >
                {opt.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </CardContent>
    </Card>
  );
}
