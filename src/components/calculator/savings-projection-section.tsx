"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import {
  formatCurrency,
  parseSalaryInput,
  sanitizeSalaryInput,
} from "@/lib/format";
import { Target, TrendingUp, Rocket, ImageIcon } from "lucide-react";

interface SavingsProjectionSectionProps {
  surplus: number;
}

function ProjectionCard({
  label,
  months,
  monthlySaving,
  goal,
}: {
  label: string;
  months: number;
  monthlySaving: number;
  goal: number;
}) {
  const projected = monthlySaving * months;
  const progress = goal > 0 ? Math.min(100, (projected / goal) * 100) : 0;
  const isGoalReached = progress >= 100;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-background p-5 shadow-sm transition-all hover:shadow-md flex-1">
      {/* Acento visual superior */}
      <div
        className={`absolute left-0 top-0 h-1 w-full ${isGoalReached ? "bg-[#1D9E75]" : "bg-muted-foreground/20"}`}
      />

      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold text-muted-foreground">{label}</p>
        {isGoalReached && <Rocket className="h-4 w-4 text-[#1D9E75]" />}
      </div>

      <p
        className={`text-2xl font-black tabular-nums tracking-tight ${isGoalReached ? "text-[#1D9E75]" : ""}`}
      >
        {formatCurrency(projected)}
      </p>

      <div className="mt-4 space-y-1.5">
        <div className="flex justify-between text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          <span>Progreso</span>
          <span>{Math.floor(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2 rounded-full" />
      </div>
    </div>
  );
}

export function SavingsProjectionSection({
  surplus,
}: SavingsProjectionSectionProps) {
  const [goalName, setGoalName] = useState("");
  const [goalAmount, setGoalAmount] = useState(0);
  const [goalDisplay, setGoalDisplay] = useState("");
  const [savePct, setSavePct] = useState(100);

  const monthlySaving = useMemo(
    () => Math.round(surplus * (savePct / 100) * 100) / 100,
    [surplus, savePct],
  );

  const monthsToGoal = useMemo(() => {
    if (goalAmount <= 0 || monthlySaving <= 0) return null;
    return Math.ceil(goalAmount / monthlySaving);
  }, [goalAmount, monthlySaving]);

  const message = useMemo(() => {
    if (!monthsToGoal || goalAmount <= 0) return null;
    if (monthsToGoal < 12) {
      return `¡Increíble! A este ritmo llegas a tu meta en solo ${monthsToGoal} meses. 🎯`;
    }
    if (monthsToGoal <= 24) {
      return `Con constancia, en ${monthsToGoal} meses tendrás lo que necesitas.`;
    }
    return `Llegarías a tu meta en ${monthsToGoal} meses. ¿Podrías recortar algún gasto variable?`;
  }, [monthsToGoal, goalAmount]);

  const handleExport = async () => {
    const el = document.getElementById("savings-projection-export");
    if (!el) return;
    const { toPng } = await import("html-to-image");
    const dataUrl = await toPng(el, { pixelRatio: 2, cacheBust: true });
    const link = document.createElement("a");
    link.download = "mi-meta-financiera.png";
    link.href = dataUrl;
    link.click();
  };

  return (
    <section
      id="bloque-ahorro"
      className="bg-card rounded-3xl shadow-sm border border-border/50 overflow-hidden flex flex-col"
      aria-labelledby="savings-heading"
    >
      {/* Cabecera */}
      <div className="p-6 pb-4 border-b border-border/40 bg-muted/20">
        <h2
          id="savings-heading"
          className="text-xl font-bold tracking-tight flex items-center gap-2"
        >
          <Target className="h-5 w-5 text-[#1D9E75]" />
          Pon a trabajar tu dinero
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Tienes{" "}
          <span className="font-bold text-foreground">
            {formatCurrency(surplus)} libres
          </span>
          . ¿Qué quieres lograr con ellos?
        </p>
      </div>

      <div id="savings-projection-export" className="bg-card">
        {/* Zona de Configuración */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="goal-name" className="text-sm font-medium">
                ¿Cuál es tu meta?
              </Label>
              <Input
                id="goal-name"
                className="h-12 rounded-xl bg-muted/40 border-transparent focus:bg-background transition-colors text-base"
                placeholder="Ej: Enganche, viaje, laptop..."
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="goal-amount" className="text-sm font-medium">
                ¿Cuánto cuesta?
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                  $
                </span>
                <Input
                  id="goal-amount"
                  type="text"
                  inputMode="decimal"
                  className="h-12 pl-8 rounded-xl bg-muted/40 border-transparent focus:bg-background transition-colors text-base font-semibold"
                  placeholder="0.00"
                  value={goalDisplay}
                  onChange={(e) => {
                    const sanitized = sanitizeSalaryInput(e.target.value);
                    setGoalDisplay(sanitized);
                    setGoalAmount(parseSalaryInput(sanitized));
                  }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl bg-muted/30 p-5 border border-border/40">
            <div className="flex justify-between items-end">
              <Label className="text-sm font-medium">
                Quiero destinar el{" "}
                <span className="text-[#1D9E75] font-bold text-lg">
                  {savePct}%
                </span>{" "}
                de mi dinero libre
              </Label>
              <span className="text-sm font-bold bg-background px-3 py-1 rounded-lg border border-border/50 shadow-sm">
                {formatCurrency(monthlySaving)} / mes
              </span>
            </div>
            <Slider
              min={0}
              max={100}
              step={5}
              value={[savePct]}
              onValueChange={(v) => setSavePct(v[0])}
              className="py-2 cursor-grab active:cursor-grabbing"
            />
          </div>
        </div>

        {/* Zona de Resultados (Ligeramente tintada) */}
        <div className="p-6 bg-gradient-to-br from-[#1D9E75]/5 to-transparent border-t border-border/40">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Proyección de crecimiento
            </h3>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <ProjectionCard
              label="En 6 meses"
              months={6}
              monthlySaving={monthlySaving}
              goal={goalAmount}
            />
            <ProjectionCard
              label="En 1 año"
              months={12}
              monthlySaving={monthlySaving}
              goal={goalAmount}
            />
            <ProjectionCard
              label="En 2 años"
              months={24}
              monthlySaving={monthlySaving}
              goal={goalAmount}
            />
          </div>

          {message && (
            <div className="mt-6 rounded-2xl bg-[#1D9E75]/10 border border-[#1D9E75]/20 p-4 flex items-center gap-3">
              <div className="bg-[#1D9E75]/20 p-2 rounded-full">
                <Rocket className="h-5 w-5 text-[#1D9E75]" />
              </div>
              <p className="text-sm font-medium text-[#147a59] dark:text-[#2dd49d]">
                {message}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer / Botón de Acción */}
      <div className="p-4 bg-muted/20 border-t border-border/40">
        <Button
          type="button"
          variant="outline"
          className="w-full h-12 rounded-xl border-border/60 hover:bg-muted/50 font-medium transition-all group"
          onClick={handleExport}
        >
          <ImageIcon className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          Guardar mi plan como imagen
        </Button>
      </div>
    </section>
  );
}
