"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { BudgetBarChart } from "@/components/charts/budget-bar-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContentStyled,
  SelectItemStyled,
  SelectTriggerStyled,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/format";
import { getAppPrefs, updateAppPrefs } from "@/lib/storage/local-storage";
import type { Expense, ExpenseCategory } from "@/lib/salary/types";
import { useSalaryStore } from "@/stores/salary-store";
import { useBudgetStore } from "@/stores/budget-store";

const EDU_SLIDES = [
  "50% para necesidades: vivienda, comida, transporte y servicios.",
  "30% para gustos: entretenimiento, salidas y suscripciones.",
  "El 20% restante es tu ahorro automático: dinero libre después de tus gastos.",
];

export function BudgetPage() {
  const salarioNeto = useSalaryStore((s) => s.getEffectiveNetSalary());
  const expenses = useBudgetStore((s) => s.expenses);
  const getSummary = useBudgetStore((s) => s.getSummary);
  const addExpense = useBudgetStore((s) => s.addExpense);
  const removeExpense = useBudgetStore((s) => s.removeExpense);
  const clearAll = useBudgetStore((s) => s.clearAll);

  const [bannerDismissed, setBannerDismissed] = useState(
    () => getAppPrefs().budget_edu_banner_dismissed ?? false,
  );
  const [slide, setSlide] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [monto, setMonto] = useState("");
  const [categoria, setCategoria] = useState<Exclude<ExpenseCategory, "ahorros">>(
    "necesidades",
  );

  if (salarioNeto <= 0) {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <CardHeader>
          <CardTitle>Primero calcula tu salario</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Necesitas un salario neto válido para organizar tu presupuesto 50/30/20.
          </p>
          <Button asChild>
            <Link href="/">Ir a Calculadora</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const summary = getSummary(salarioNeto);

  const handleAdd = () => {
    const value = parseFloat(monto);
    if (!nombre.trim() || !value || value <= 0) {
      toast.error("Completa nombre y monto válido");
      return;
    }
    addExpense({
      nombre: nombre.trim(),
      monto: value,
      categoria,
      esRecurrente: true,
    });
    setDialogOpen(false);
    setNombre("");
    setMonto("");
    toast.success("Gasto agregado");
  };

  const dismissBanner = () => {
    setBannerDismissed(true);
    updateAppPrefs({ budget_edu_banner_dismissed: true });
  };

  const renderCategory = (
    title: string,
    presupuesto: number,
    gastado: number,
    diferencia: number,
    category: Exclude<ExpenseCategory, "ahorros">,
    readonly = false,
  ) => {
    const items = expenses.filter((e) => e.categoria === category);
    const pct = presupuesto > 0 ? Math.min(100, (gastado / presupuesto) * 100) : 0;

    return (
      <Card key={title}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(gastado)} de {formatCurrency(presupuesto)}
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <Progress value={pct} aria-label={`Progreso ${title}`} />
          {!readonly &&
            items.map((e: Expense) => (
              <div key={e.id} className="flex items-center justify-between text-sm">
                <span>{e.nombre}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{formatCurrency(e.monto)}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Eliminar ${e.nombre}`}
                    onClick={() => removeExpense(e.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          {readonly && (
            <p className="text-sm text-muted-foreground">
              Tu ahorro se calcula automáticamente: lo que sobra después de cubrir
              necesidades y gustos.
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Disponible: {formatCurrency(diferencia)}
          </p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Mi Presupuesto</h2>
        <p className="text-sm text-muted-foreground">
          Regla 50/30/20 sobre {formatCurrency(salarioNeto)} netos
        </p>
      </div>

      {!bannerDismissed && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex items-start justify-between gap-4 p-4">
            <div className="space-y-2 text-sm">
              <p className="font-medium">¿Cómo funciona?</p>
              <p>{EDU_SLIDES[slide]}</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSlide((s) => (s + 1) % EDU_SLIDES.length)}
                >
                  Siguiente
                </Button>
                <Button size="sm" variant="ghost" onClick={dismissBanner}>
                  Entendido
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-secondary/20">
        <CardHeader>
          <CardTitle>Tu dinero libre (ahorro automático)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-primary">
            {formatCurrency(summary.totalAhorros)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Proyección anual: {formatCurrency(summary.totalAhorros * 12)}
          </p>
        </CardContent>
      </Card>

      <BudgetBarChart
        presupuesto={[
          summary.presupuestoNecesidades,
          summary.presupuestoGustos,
          summary.presupuestoAhorros,
        ]}
        gastado={[
          summary.totalNecesidades,
          summary.totalGustos,
          summary.totalAhorros,
        ]}
      />

      {renderCategory(
        "Necesidades (50%)",
        summary.presupuestoNecesidades,
        summary.totalNecesidades,
        summary.diferenciaNecesidades,
        "necesidades",
      )}
      {renderCategory(
        "Gustos (30%)",
        summary.presupuestoGustos,
        summary.totalGustos,
        summary.diferenciaGustos,
        "gustos",
      )}
      {renderCategory(
        "Ahorro libre (20% objetivo)",
        summary.presupuestoAhorros,
        summary.totalAhorros,
        summary.diferenciaAhorros,
        "necesidades",
        true,
      )}

      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Agregar gasto
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            if (confirm("¿Borrar todos los gastos?")) {
              clearAll();
              toast.success("Presupuesto limpiado");
            }
          }}
        >
          Limpiar presupuesto
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar gasto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="expense-name">Nombre</Label>
              <Input
                id="expense-name"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expense-amount">Monto</Label>
              <Input
                id="expense-amount"
                type="number"
                min={0}
                step={0.01}
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Categoría</Label>
              <Select
                value={categoria}
                onValueChange={(v) =>
                  setCategoria(v as Exclude<ExpenseCategory, "ahorros">)
                }
              >
                <SelectTriggerStyled>
                  <SelectValue />
                </SelectTriggerStyled>
                <SelectContentStyled>
                  <SelectItemStyled value="necesidades">Necesidades</SelectItemStyled>
                  <SelectItemStyled value="gustos">Gustos</SelectItemStyled>
                </SelectContentStyled>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAdd}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
