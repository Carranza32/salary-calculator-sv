"use client";

import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";
import { formatCurrency } from "@/lib/format";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface BudgetBarChartProps {
  presupuesto: [number, number, number];
  gastado: [number, number, number];
}

export function BudgetBarChart({ presupuesto, gastado }: BudgetBarChartProps) {
  const options: ApexOptions = {
    chart: { type: "bar", toolbar: { show: false }, fontFamily: "inherit" },
    plotOptions: { bar: { borderRadius: 6, horizontal: true } },
    colors: ["var(--chart-2)", "var(--chart-1)"],
    xaxis: {
      categories: ["Necesidades", "Gustos", "Ahorro libre"],
    },
    legend: { position: "top" },
    dataLabels: { enabled: false },
    tooltip: {
      y: { formatter: (val) => formatCurrency(val) },
    },
  };

  return (
    <Chart
      options={options}
      series={[
        { name: "Presupuesto", data: presupuesto },
        { name: "Gastado / real", data: gastado },
      ]}
      type="bar"
      height={220}
      width="100%"
    />
  );
}
