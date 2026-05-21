"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Home, PiggyBank, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { formatCurrency, formatPercent } from "@/lib/format";
import {
  adjustDistribution,
  amountsFromDistribution,
  calcular503020,
  getDistributionDiagnostic,
  type DistributionKey,
} from "@/lib/salary";
import { useSalaryStore } from "@/stores/salary-store";

const BUCKET_META: {
  key: DistributionKey;
  label: string;
  idealPct: number;
  icon: typeof Home;
  colorClass: string;
}[] = [
  {
    key: "necesidades",
    label: "Necesidades",
    idealPct: 50,
    icon: Home,
    colorClass: "border-chart-1/40 bg-chart-1/10",
  },
  {
    key: "gustos",
    label: "Gustos",
    idealPct: 30,
    icon: Sparkles,
    colorClass: "border-chart-2/40 bg-chart-2/10",
  },
  {
    key: "ahorros",
    label: "Ahorro",
    idealPct: 20,
    icon: PiggyBank,
    colorClass: "border-chart-3/40 bg-chart-3/10",
  },
];

const BADGE_STYLES = {
  saludable:
    "border-emerald-500/50 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  ajustado:
    "border-amber-500/50 bg-amber-500/15 text-amber-800 dark:text-amber-200",
  en_riesgo: "border-red-500/50 bg-red-500/15 text-red-700 dark:text-red-300",
} as const;

export function TeAlcanzaSection() {
  const result = useSalaryStore((s) => s.result);
  const distribution = useSalaryStore((s) => s.distribution);
  const setDistribution = useSalaryStore((s) => s.setDistribution);

  const [expanded, setExpanded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const salarioNeto = result?.salarioNeto ?? 0;
  const ideal = salarioNeto > 0 ? calcular503020(salarioNeto) : null;
  const amounts =
    salarioNeto > 0 ? amountsFromDistribution(salarioNeto, distribution) : null;
  const diagnostic = getDistributionDiagnostic(distribution);

  const handleSlider = useCallback(
    (key: DistributionKey, value: number[]) => {
      setDistribution(adjustDistribution(distribution, key, value[0]));
    },
    [distribution, setDistribution],
  );

  const openSection = () => {
    setExpanded(true);
    requestAnimationFrame(() => {
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  if (!result || salarioNeto <= 0 || !ideal || !amounts) return null;

  return (
    <div className="space-y-4">
      {!expanded ? (
        <Card className="border-dashed border-primary/40 bg-primary/5">
          <CardContent className="flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:text-left">
            <div className="flex-1 space-y-1">
              <p className="text-lg font-semibold">¿Te alcanza tu salario?</p>
              <p className="text-sm text-muted-foreground">
                Ajusta la regla 50/30/20 a tu realidad y recibe un diagnóstico al instante.
              </p>
            </div>
            <Button
              type="button"
              size="lg"
              className="min-h-11 w-full sm:w-auto"
              onClick={openSection}
            >
              Explorar distribución
              <ChevronDown className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card
          ref={sectionRef}
          id="te-alcanza"
          className="scroll-mt-28 border-primary/20 transition-all duration-500"
        >
          <CardHeader className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="text-xl">¿Te alcanza?</CardTitle>
              <Badge
                className={cn(
                  "px-3 py-1 text-sm font-semibold",
                  BADGE_STYLES[diagnostic.status],
                )}
              >
                {diagnostic.label} · {formatPercent(diagnostic.ahorroPct)} ahorro
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{diagnostic.message}</p>
          </CardHeader>

          <CardContent className="space-y-8">
            <div>
              <p className="mb-3 text-sm font-medium text-muted-foreground">
                Recomendación 50/30/20 sobre {formatCurrency(salarioNeto)}
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {BUCKET_META.map(({ key, label, idealPct, icon: Icon, colorClass }) => (
                  <div
                    key={key}
                    className={cn(
                      "rounded-[20px] border p-4 text-center",
                      colorClass,
                    )}
                  >
                    <Icon className="mx-auto mb-2 h-5 w-5 text-primary" aria-hidden />
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {label} {idealPct}%
                    </p>
                    <p className="mt-1 text-lg font-bold">{formatCurrency(ideal[key])}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6 rounded-[20px] border bg-muted/30 p-4 sm:p-6">
              <p className="text-sm font-medium">
                Tu distribución real (los sliders siempre suman 100%)
              </p>
              {BUCKET_META.map(({ key, label, icon: Icon }) => (
                <div key={key} className="space-y-3">
                  <div className="flex flex-wrap items-end justify-between gap-2">
                    <Label
                      htmlFor={`slider-${key}`}
                      className="flex min-h-11 items-center gap-2 text-base"
                    >
                      <Icon className="h-4 w-4 text-primary" aria-hidden />
                      {label}
                    </Label>
                    <div className="text-right">
                      <p className="text-lg font-bold">{formatCurrency(amounts[key])}</p>
                      <p className="text-xs text-muted-foreground">
                        {distribution[key]}% del neto
                      </p>
                    </div>
                  </div>
                  <Slider
                    id={`slider-${key}`}
                    min={5}
                    max={90}
                    step={1}
                    value={[distribution[key]]}
                    onValueChange={(v) => handleSlider(key, v)}
                    aria-label={`Porcentaje ${label}`}
                    className="py-3"
                  />
                </div>
              ))}
            </div>

            <Button asChild size="lg" className="min-h-11 w-full">
              <Link href="/presupuesto">
                Ver mis gastos reales
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
