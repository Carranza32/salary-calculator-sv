import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { calcular503020 } from "@/lib/salary";
import { formatCurrency } from "@/lib/format";
import type { SalaryResult, BenefitsProjection } from "@/lib/salary/types";

export async function exportResultAsImage(elementId: string): Promise<void> {
  const node = document.getElementById(elementId);
  if (!node) throw new Error("Elemento no encontrado");

  const dataUrl = await toPng(node, {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: "#ffffff",
  });

  const link = document.createElement("a");
  link.download = `calculo_salarial_${Date.now()}.png`;
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
  viewPerspective: "empleado" | "empleador" = "empleado",
  includeInsaforp = false,
  benefits: BenefitsProjection | null = null,
  note?: string,
): Promise<void> {
  try {
    console.log("exportResultAsPdf: Iniciando procesamiento de PDF...");
    const buckets = calcular503020(result.salarioNeto);
    console.log("exportResultAsPdf: buckets calculados", buckets);
    
    console.log("exportResultAsPdf: Inicializando jsPDF...");
    const doc = new jsPDF();
    
    console.log("exportResultAsPdf: Obteniendo fecha local...");
    const now = new Date().toLocaleString("es-SV", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const isFreelance = result.isFreelance;
    const isEmployer = viewPerspective === "empleador" && !isFreelance;

    // Visual Theme Colors
    const primaryColor = isEmployer ? [79, 70, 229] : [18, 122, 87]; // Indigo vs Emerald
    const grayText = [100, 116, 139];
    const darkText = [30, 41, 59];

    let y = 0;

    // Header band
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 32, "F");

    // Title in Header
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text("SIMULACIÓN DE DETALLE SALARIAL (EL SALVADOR)", 14, 14);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const subTitleText = isFreelance
      ? "CONTRATACIÓN POR SERVICIOS PROFESIONALES · ESTIMACIÓN 2026"
      : isEmployer
      ? "COSTOS PATRONALES Y CARGAS LABORALES DE LEY · ESTIMACIÓN 2026"
      : "DESGLOSE DE PLANILLA Y RETENCIONES DEL COLABORADOR · ESTIMACIÓN 2026";
    doc.text(subTitleText, 14, 20);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.text(`Generado el: ${now}`, 14, 26);

    // Executive summary card background
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, 38, 182, 38, 4, 4, "F");

    // Executive text
    doc.setTextColor(grayText[0], grayText[1], grayText[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    const mainLabel = isEmployer
      ? "COSTO TOTAL ESTIMADO PARA LA EMPRESA (MENSUAL)"
      : "SALARIO NETO LÍQUIDO A RECIBIR (MENSUAL)";
    doc.text(mainLabel, 20, 48);

    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    const totalInsaforp = includeInsaforp ? result.insaforpPatronal : 0;
    const mainAmount = isEmployer
      ? result.salarioBruto + result.deduccionesTotalesPatronales + totalInsaforp
      : result.salarioNeto;
    doc.text(formatCurrency(mainAmount), 20, 60);

    // Summary secondary info
    doc.setTextColor(darkText[0], darkText[1], darkText[2]);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    let summaryDetails = `Salario Bruto de Base: ${formatCurrency(result.salarioBruto)}`;
    if (!isFreelance) {
      summaryDetails += `   ·   Quincena: ${formatCurrency(isEmployer ? (result.salarioBruto + result.deduccionesTotalesPatronales + totalInsaforp) / 2 : result.salarioNeto / 2)}`;
    }
    doc.text(summaryDetails, 20, 69);

    if (note) {
      y = 88;
      doc.setTextColor(darkText[0], darkText[1], darkText[2]);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.text(`Nota del Cálculo:`, 14, y);
      doc.setFont("helvetica", "normal");
      doc.text(note, 45, y);
    }

    y = note ? 98 : 88;

    // Helper drawing functions
    const drawSectionHeader = (title: string) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text(title, 14, y);
      y += 2.5;
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setLineWidth(0.4);
      doc.line(14, y, 196, y);
      y += 6;
    };

    const drawRow = (label: string, value: string, isBold = false, isSubText = false) => {
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      doc.setFontSize(isSubText ? 8.5 : 9.5);
      doc.setTextColor(isBold ? darkText[0] : 80, isBold ? darkText[1] : 80, isBold ? darkText[2] : 80);
      
      doc.text(label, 16, y);
      doc.text(value, 194, y, { align: "right" });
      
      // Line separator
      doc.setDrawColor(241, 245, 249);
      doc.setLineWidth(0.25);
      doc.line(14, y + 2, 196, y + 2);
      y += 6.5;
    };

    // Section 1: Retenciones y Descuentos Mensuales
    console.log("exportResultAsPdf: Dibujando Sección 1...");
    drawSectionHeader("DESGLOSE MENSUAL DE DETALLES");
    drawRow("Salario Bruto Pactado", formatCurrency(result.salarioBruto));

    if (isFreelance) {
      drawRow("Retención Impuesto sobre la Renta (10% fijo)", `-${formatCurrency(result.renta)}`);
      drawRow("Total Retenciones Mensuales", `-${formatCurrency(result.totalDeducciones)}`, true);
      drawRow("Líquido Neto Final a Recibir", formatCurrency(result.salarioNeto), true);
    } else {
      drawRow("AFP Trabajador (7.25%)", `-${formatCurrency(result.afpTrabajador)}`);
      drawRow("ISSS Trabajador (3.0% - tope $1,000)", `-${formatCurrency(result.isssTrabajador)}`);
      drawRow("Impuesto sobre la Renta (ISR - según tramos)", `-${formatCurrency(result.renta)}`);
      drawRow("Total Descuentos Mensuales de Colaborador", `-${formatCurrency(result.totalDeducciones)}`, true);
      drawRow("Salario Líquido Neto a Recibir", formatCurrency(result.salarioNeto), true);
    }

    y += 5;

    // Section 2: Cargas Patronales (Patrono Perspective or Employer View)
    if (!isFreelance) {
      console.log("exportResultAsPdf: Dibujando Sección 2...");
      drawSectionHeader("CARGAS Y OBLIGACIONES PATRONALES (APORTES DEL EMPLEADOR)");
      drawRow("AFP Patronal (8.75%)", `+${formatCurrency(result.afpPatronal)}`);
      drawRow("ISSS Patronal (7.5% - tope $1,000)", `+${formatCurrency(result.isssPatronal)}`);
      drawRow(`INSAFORP Patronal (1.0% - tope $1,000)${!includeInsaforp ? " (No aplicado)" : ""}`, `+${formatCurrency(totalInsaforp)}`);
      
      const totalCargas = result.deduccionesTotalesPatronales + totalInsaforp;
      drawRow("Total Cargas Sociales de Empleador", `+${formatCurrency(totalCargas)}`, true);
      drawRow("Costo Mensual Total de Planilla (Bruto + Cargas)", formatCurrency(result.salarioBruto + totalCargas), true);

      y += 5;
    }

    // Section 3: Beneficios y Proyecciones Anuales (Employee/Planilla only)
    if (!isFreelance && benefits) {
      console.log("exportResultAsPdf: Dibujando Sección 3...");
      drawSectionHeader("PROYECCIÓN DE PRESTACIONES ANUALES OBLIGATORIAS");
      drawRow("Aguinaldo Anual Estimado", formatCurrency(benefits.aguinaldo));
      drawRow("Vacaciones Anuales + Prima Vacacional (30% Extra)", formatCurrency(benefits.vacaciones));
      drawRow("Reserva Anual para Indemnización Legal", formatCurrency(benefits.indemnizacion));
      drawRow("Total Beneficios Extra Anuales de Ley", formatCurrency(benefits.total), true);

      y += 5;
    }

    // Section 4: Regla de Presupuesto 50/30/20 (Employee View)
    if (!isEmployer && !isFreelance) {
      console.log("exportResultAsPdf: Dibujando Sección 4...");
      drawSectionHeader("RECOMENDACIÓN DE PRESUPUESTO PERSONAL (REGLA 50/30/20)");
      drawRow("Necesidades (50% del Neto Líquido) - Gastos fijos", formatCurrency(buckets.necesidades));
      drawRow("Gustos (30% del Neto Líquido) - Estilo de vida", formatCurrency(buckets.gustos));
      drawRow("Ahorros y Inversiones (20% del Neto Líquido)", formatCurrency(buckets.ahorros));
      y += 5;
    }

    // Footer Disclaimer
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8.5);
    doc.setTextColor(grayText[0], grayText[1], grayText[2]);
    
    const disclaimerText = 
      "Aviso de Simulación: Este documento refleja estimaciones basadas en la legislación laboral y fiscal vigente en El Salvador para el año 2026 (Ley del Seguro Social, Ley del SAP y Código de Trabajo). No representa un comprobante contable u oficial. Para decisiones financieras, consulte a un especialista o departamento de RRHH.";
    doc.text(disclaimerText, 14, y, { maxWidth: 182 });

    // Save the generated document
    console.log("exportResultAsPdf: Guardando documento...");
    doc.save(`reporte_salario_${Date.now()}.pdf`);
    console.log("exportResultAsPdf: Guardado completo.");
  } catch (err) {
    console.error("exportResultAsPdf: Error crítico en generación de PDF:", err);
    throw err;
  }
}
