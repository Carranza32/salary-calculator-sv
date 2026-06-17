"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { HistoryCompareChart } from "@/components/charts/history-compare-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { getHistoryDisplayTitle } from "@/lib/salary";
import { formatCurrency, formatDate } from "@/lib/format";
import type { SalaryHistoryEntry } from "@/lib/salary/types";
import { useHistoryStore } from "@/stores/history-store";
import { useSalaryStore } from "@/stores/salary-store";

const MAX_COMPARE = 3;

export function HistoryPage() {
  const router = useRouter();
  const entries = useHistoryStore((s) => s.entries);
  const removeEntry = useHistoryStore((s) => s.removeEntry);
  const clearAll = useHistoryStore((s) => s.clearAll);

  const setSalary = useSalaryStore((s) => s.setSalary);
  const setAfpEntity = useSalaryStore((s) => s.setAfpEntity);
  const setTenure = useSalaryStore((s) => s.setTenure);
  const clearSimulation = useSalaryStore((s) => s.clearSimulation);

  const [selected, setSelected] = useState<string[]>([]);
  const [detail, setDetail] = useState<SalaryHistoryEntry | null>(null);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_COMPARE) {
        toast.message(`Máximo ${MAX_COMPARE} ofertas para comparar`);
        return prev;
      }
      return [...prev, id];
    });
  };

  const compareEntries = entries.filter((e) => selected.includes(e.id));

  const tryInBudget = (entry: SalaryHistoryEntry) => {
    setSalary(entry.salarioBruto);
    setAfpEntity(entry.afpEntidad);
    if (entry.tenure) setTenure(entry.tenure);
    clearSimulation();
    router.push("/presupuesto");
    toast.success("Presupuesto actualizado con nuevo salario");
  };

  if (entries.length === 0) {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <CardHeader>
          <CardTitle>Sin cálculos guardados</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Guarda tus cálculos desde la calculadora para comparar ofertas de
            trabajo lado a lado.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Historial</h1>
          <p className="text-sm text-muted-foreground">
            Selecciona hasta {MAX_COMPARE} ofertas para comparar
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            if (confirm("¿Eliminar todo el historial?")) {
              clearAll();
              setSelected([]);
            }
          }}
        >
          Limpiar todo
        </Button>
      </div>

      {compareEntries.length >= 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Comparación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 overflow-x-auto">
            <HistoryCompareChart entries={compareEntries} />
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="py-2">Oferta</th>
                  <th>Bruto</th>
                  <th>Neto</th>
                  <th>Deducciones</th>
                </tr>
              </thead>
              <tbody>
                {compareEntries.map((e) => (
                  <tr key={e.id} className="border-b">
                    <td className="py-2 font-medium">
                      {getHistoryDisplayTitle(e)}
                    </td>
                    <td>{formatCurrency(e.salarioBruto)}</td>
                    <td>{formatCurrency(e.salarioNeto)}</td>
                    <td>{formatCurrency(e.totalDeducciones)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-3">
        {entries.map((entry) => (
          <Card
            key={entry.id}
            className="cursor-pointer transition-colors hover:bg-accent/30"
            onClick={() => setDetail(entry)}
          >
            <CardContent className="flex items-center gap-4 p-4">
              <Checkbox
                checked={selected.includes(entry.id)}
                onCheckedChange={() => toggleSelect(entry.id)}
                onClick={(e) => e.stopPropagation()}
                aria-label={`Seleccionar ${getHistoryDisplayTitle(entry)}`}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">
                  {getHistoryDisplayTitle(entry)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Bruto {formatCurrency(entry.salarioBruto)} · Neto{" "}
                  {formatCurrency(entry.salarioNeto)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(entry.fecha)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  removeEntry(entry.id);
                  setSelected((s) => s.filter((id) => id !== entry.id));
                }}
              >
                Eliminar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Sheet open={!!detail} onOpenChange={(open) => !open && setDetail(null)}>
        <SheetContent>
          {detail && (
            <>
              <SheetHeader>
                <SheetTitle>{getHistoryDisplayTitle(detail)}</SheetTitle>
                <SheetDescription>{formatDate(detail.fecha)}</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-2 text-sm">
                <p>Bruto: {formatCurrency(detail.salarioBruto)}</p>
                <p>Neto: {formatCurrency(detail.salarioNeto)}</p>
                <p>Quincenal: {formatCurrency(detail.salarioNetoQuincenal)}</p>
                <p>AFP: {formatCurrency(detail.afpTrabajador)}</p>
                <p>ISSS: {formatCurrency(detail.isssTrabajador)}</p>
                <p>ISR: {formatCurrency(detail.renta)}</p>
                <p>AFP entidad: {detail.afpEntidad}</p>
              </div>
              <Button className="mt-6 w-full" onClick={() => tryInBudget(detail)}>
                Probar en mi presupuesto
              </Button>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
