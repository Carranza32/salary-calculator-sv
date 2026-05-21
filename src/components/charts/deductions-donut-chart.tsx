"use client";

import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";
import { formatCurrency } from "@/lib/format";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface DeductionsDonutChartProps {
  afp: number;
  isss: number;
  isr: number;
}

export function DeductionsDonutChart({ afp, isss, isr }: DeductionsDonutChartProps) {
  const series = [afp, isss, isr];
  const total = series.reduce((a, b) => a + b, 0);
  const labels = ["AFP 7.25%", "ISSS 3%", "ISR"];

  const options: ApexOptions = {
    chart: { type: "donut", fontFamily: "inherit" },
    labels,
    colors: ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)"],
    legend: { position: "bottom" },
    dataLabels: { enabled: false },
    tooltip: {
      y: {
        formatter: (val: number) => {
          const pct =
            total > 0 ? (((val as number) / total) * 100).toFixed(1) : "0";
          return `${formatCurrency(val)} (${pct}%)`;
        },
        title: {
          formatter: (seriesName: string) => seriesName,
        },
      },
    },
    plotOptions: {
      pie: { donut: { size: "65%" } },
    },
  };

  if (series.every((v) => v === 0)) return null;

  return (
    <Chart options={options} series={series} type="donut" height={260} width="100%" />
  );
}
