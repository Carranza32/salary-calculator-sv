"use client";

import dynamic from "next/dynamic";
import { useSalaryStore } from "@/stores/salary-store";
import { formatCurrency } from "@/lib/format";
import { useTheme } from "next-themes";
import type { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function DeductionsDonutChart({ compact = false }: { compact?: boolean }) {
  const result = useSalaryStore((s) => s.result);
  const viewPerspective = useSalaryStore((s) => s.viewPerspective);
  const includeInsaforp = useSalaryStore((s) => s.includeInsaforp);
  const { theme } = useTheme();

  if (!result || result.salarioBruto <= 0) return null;

  const isFreelance = result.isFreelance;

  let labels: string[] = [];
  let series: number[] = [];
  let colors: string[] = [];

  if (viewPerspective === "empleado" || isFreelance) {
    if (isFreelance) {
      labels = ["Salario Neto (Líquido)", "Retención Renta (10%)"];
      series = [result.salarioNeto, result.renta];
      colors = ["#1D9E75", "#EF4444"]; // Emerald, Red
    } else {
      labels = [
        "Salario Neto (Líquido)",
        "AFP Colaborador (7.25%)",
        "ISSS Colaborador (3%)",
        "Retención ISR (Renta)",
      ];
      series = [
        result.salarioNeto,
        result.afpTrabajador,
        result.isssTrabajador,
        result.renta,
      ];
      colors = ["#1D9E75", "#7C3AED", "#2563EB", "#EF4444"]; // Emerald, Violet, Blue, Red
    }
  } else {
    // Employer view (planilla only, freelance doesn't have employer additions)
    labels = [
      "Salario Neto (Líquido)",
      "AFP Colaborador",
      "ISSS Colaborador",
      "Retención ISR (Renta)",
      "AFP Patronal (8.75%)",
      "ISSS Patronal (7.5%)",
    ];
    series = [
      result.salarioNeto,
      result.afpTrabajador,
      result.isssTrabajador,
      result.renta,
      result.afpPatronal,
      result.isssPatronal,
    ];
    colors = ["#1D9E75", "#7C3AED", "#2563EB", "#EF4444", "#A855F7", "#6366F1"];

    if (includeInsaforp) {
      labels.push("Insaforp Patronal (1%)");
      series.push(result.insaforpPatronal);
      colors.push("#64748B"); // Gray
    }
  }
  const total = series.reduce((a, b) => a + b, 0);
  const legendItems = labels.map((label, idx) => {
    const value = series[idx];
    const percentage = total > 0 ? (value / total) * 100 : 0;
    return {
      label,
      value,
      percentage,
      color: colors[idx],
    };
  });

  const options: ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "inherit",
      background: "transparent",
    },
    labels,
    colors,
    stroke: {
      show: true,
      width: 2,
      colors: theme === "dark" ? ["#1f2937"] : ["#ffffff"],
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    tooltip: {
      y: {
        formatter: (val) => formatCurrency(val),
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "14px",
              color: theme === "dark" ? "#9ca3af" : "#4b5563",
            },
            value: {
              show: true,
              fontSize: "20px",
              fontWeight: "bold",
              color: theme === "dark" ? "#f9fafb" : "#111827",
              formatter: (val) => {
                const num = typeof val === "number" ? val : parseFloat(val);
                return formatCurrency(isNaN(num) ? 0 : num);
              },
            },
            total: {
              show: true,
              label: viewPerspective === "empleado" ? "Salario Bruto" : "Costo Total",
              color: theme === "dark" ? "#9ca3af" : "#4b5563",
              formatter: () => {
                if (viewPerspective === "empleado" || isFreelance) {
                  return formatCurrency(result.salarioBruto);
                }
                const totalPatronal =
                  result.deduccionesTotalesPatronales +
                  (includeInsaforp ? result.insaforpPatronal : 0);
                return formatCurrency(result.salarioBruto + totalPatronal);
              },
            },
          },
        },
      },
    },
    theme: {
      mode: theme === "dark" ? "dark" : "light",
    },
  };

  if (compact) {
    return (
      <div className="bg-card border rounded-3xl p-6 shadow-sm h-full flex flex-col justify-center items-center w-full min-h-[280px]">
        <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-4 text-center">
          Distribución Visual
        </h4>
        <div className="w-full max-w-[200px] flex justify-center items-center flex-grow">
          <Chart
            options={options}
            series={series}
            type="donut"
            width="100%"
            height={200}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-3xl p-6 md:p-8 shadow-sm">
      <h3 className="text-base md:text-lg font-bold text-foreground mb-6">
        Distribución del Salario ({viewPerspective === "empleado" ? "Empleado" : "Costo Empleador"})
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Gráfico (Columna Izquierda) */}
        <div className="col-span-12 md:col-span-5 flex justify-center">
          <div className="w-full max-w-[280px]">
            <Chart
              options={options}
              series={series}
              type="donut"
              width="100%"
              height={260}
            />
          </div>
        </div>

        {/* Leyenda Personalizada (Columna Derecha) */}
        <div className="col-span-12 md:col-span-7 bg-muted/10 p-3 md:p-4 rounded-2xl border border-border/20 space-y-1">
          {legendItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-2.5 border-b border-border/40 last:border-b-0 hover:bg-muted/50 transition-all duration-200 px-3 rounded-xl cursor-default group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium text-foreground/90 group-hover:text-foreground transition-colors truncate">
                  {item.label}
                </span>
              </div>
              <div className="flex items-center gap-4 text-right flex-shrink-0 font-mono">
                <span className="text-sm font-bold text-foreground tabular-nums">
                  {formatCurrency(item.value)}
                </span>
                <span className="text-xs text-muted-foreground font-semibold w-12 tabular-nums group-hover:text-foreground transition-colors">
                  {item.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default DeductionsDonutChart;
