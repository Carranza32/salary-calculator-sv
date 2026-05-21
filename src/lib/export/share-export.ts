import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { calcular503020 } from "@/lib/salary";
import { formatCurrency } from "@/lib/format";
import type { SalaryResult } from "@/lib/salary/types";

export async function exportResultAsImage(elementId: string): Promise<void> {
  const node = document.getElementById(elementId);
  if (!node) throw new Error("Elemento no encontrado");

  const dataUrl = await toPng(node, {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: "#ffffff",
  });

  const link = document.createElement("a");
  link.download = `salary_calculation_${Date.now()}.png`;
  link.href = dataUrl;
  link.click();

  if (navigator.share) {
    try {
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], link.download, { type: "image/png" });
      await navigator.share({
        title: "Calculadora Salarial SV",
        files: [file],
      });
    } catch {
      // user cancelled share
    }
  }
}

export async function exportResultAsPdf(
  result: SalaryResult,
  note?: string,
): Promise<void> {
  const buckets = calcular503020(result.salarioNeto);
  const doc = new jsPDF();
  const now = new Date().toLocaleString("es-SV");
  let y = 16;

  const line = (text: string, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.text(text, 14, y);
    y += 8;
  };

  line("Calculadora Salarial SV", true);
  line(`Fecha: ${now}`);
  if (note) line(`Nota: ${note}`);
  y += 4;

  line(`Salario bruto: ${formatCurrency(result.salarioBruto)}`);
  line(`AFP: ${result.afpEntidad}`);
  line(`AFP trabajador: ${formatCurrency(result.afpTrabajador)}`);
  line(`ISSS trabajador: ${formatCurrency(result.isssTrabajador)}`);
  line(`ISR: ${formatCurrency(result.renta)}`);
  line(`Total deducciones: ${formatCurrency(result.totalDeducciones)}`, true);
  line(`AFP patronal: ${formatCurrency(result.afpPatronal)}`);
  line(`ISSS patronal: ${formatCurrency(result.isssPatronal)}`);
  line(`Neto mensual: ${formatCurrency(result.salarioNeto)}`, true);
  line(`Neto quincenal: ${formatCurrency(result.salarioNetoQuincenal)}`);
  y += 4;
  line("Regla 50/30/20:", true);
  line(`Necesidades: ${formatCurrency(buckets.necesidades)}`);
  line(`Gustos: ${formatCurrency(buckets.gustos)}`);
  line(`Ahorros: ${formatCurrency(buckets.ahorros)}`);
  y += 6;
  doc.setFontSize(9);
  doc.text(
    "Cálculo estimado con base en normativa 2025. Consulte a un contador para decisiones formales.",
    14,
    y,
    { maxWidth: 180 },
  );

  doc.save(`salary_calculation_${Date.now()}.pdf`);
}
