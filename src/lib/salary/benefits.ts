import {
  AGUINALDO_DIAS_POR_TENURE,
  DIAS_MES_SALARIO,
  INDEMNIZACION_ANIOS_POR_TENURE,
  INDEMNIZACION_DIAS_MINIMOS,
  VACACIONES_DIAS,
  VACACIONES_PRIMA_RATE,
} from "./constants";
import type { BenefitsProjection, TenureKey } from "./types";

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function calcularBeneficiosAnuales(
  salarioBruto: number,
  tenureKey: TenureKey,
): BenefitsProjection {
  const salarioDiario = salarioBruto / DIAS_MES_SALARIO;
  const diasAguinaldo = AGUINALDO_DIAS_POR_TENURE[tenureKey];
  const aguinaldo = round2(diasAguinaldo * salarioDiario);
  const vacaciones = round2(
    VACACIONES_DIAS * salarioDiario * (1 + VACACIONES_PRIMA_RATE),
  );

  const aniosEstimados = INDEMNIZACION_ANIOS_POR_TENURE[tenureKey];
  const diasIndemnizacion = Math.max(
    INDEMNIZACION_DIAS_MINIMOS,
    aniosEstimados * 30,
  );
  const indemnizacion = round2(diasIndemnizacion * salarioDiario);

  return {
    aguinaldo,
    vacaciones,
    indemnizacion,
    total: round2(aguinaldo + vacaciones + indemnizacion),
    tenureKey,
  };
}

export function calcularAhorroAnual(salarioNeto: number): {
  mensual: number;
  anual: number;
} {
  const mensual = round2(salarioNeto * 0.2);
  return { mensual, anual: round2(mensual * 12) };
}
