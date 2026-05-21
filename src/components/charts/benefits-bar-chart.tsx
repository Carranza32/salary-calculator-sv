"use client";

import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";
import { formatCurrency } from "@/lib/format";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface BenefitsBarChartProps {
  aguinaldo: number;
  vacaciones: number;
  indemnizacion: number;
}

export function BenefitsBarChart({
  aguinaldo,
  vacaciones,
  indemnizacion,
}: BenefitsBarChartProps) {
  const options: ApexOptions = {
    chart: { type: "bar", toolbar: { show: false }, fontFamily: "inherit" },
    plotOptions: { bar: { borderRadius: 8, horizontal: true } },
    colors: ["var(--chart-1)", "var(--chart-2)", "var(--chart-4)"],
    xaxis: {
      categories: ["Aguinaldo", "Vacaciones", "Indemnización"],
    },
    dataLabels: { enabled: false },
    tooltip: {
      y: { formatter: (val) => formatCurrency(val) },
    },
  };

  return (
    <Chart
      options={options}
      series={[{ name: "Estimado anual", data: [aguinaldo, vacaciones, indemnizacion] }]}
      type="bar"
      height={200}
      width="100%"
    />
  );
}
