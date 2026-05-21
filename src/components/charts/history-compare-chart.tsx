"use client";

import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";
import { formatCurrency } from "@/lib/format";
import type { SalaryHistoryEntry } from "@/lib/salary/types";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface HistoryCompareChartProps {
  entries: SalaryHistoryEntry[];
}

export function HistoryCompareChart({ entries }: HistoryCompareChartProps) {
  const labels = entries.map(
    (e) => e.title?.slice(0, 20) ?? formatCurrency(e.salarioBruto),
  );

  const options: ApexOptions = {
    chart: { type: "bar", toolbar: { show: false }, fontFamily: "inherit" },
    plotOptions: { bar: { borderRadius: 6 } },
    colors: ["var(--chart-2)", "var(--chart-1)"],
    xaxis: { categories: labels },
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
        { name: "Bruto", data: entries.map((e) => e.salarioBruto) },
        { name: "Neto", data: entries.map((e) => e.salarioNeto) },
      ]}
      type="bar"
      height={280}
      width="100%"
    />
  );
}
