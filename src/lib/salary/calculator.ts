import {
  AFP_PATRONAL_RATE,
  AFP_TRABAJADOR_RATE,
  DEFAULT_AFP_ENTIDAD,
  ISR_TABLA_MENSUAL,
  ISSS_PATRONAL_RATE,
  ISSS_TOPE_PATRONAL,
  ISSS_TOPE_SALARIO,
  ISSS_TOPE_TRABAJADOR,
  ISSS_TRABAJADOR_RATE,
  SALARIO_MINIMO_INDUSTRIA,
} from "./constants";
import type { AfpEntidad, SalaryResult, SalaryResultComputed } from "./types";

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function calcularAFPTrabajador(salarioBruto: number): number {
  return round2(salarioBruto * AFP_TRABAJADOR_RATE);
}

export function calcularAFPPatronal(salarioBruto: number): number {
  return round2(salarioBruto * AFP_PATRONAL_RATE);
}

export function calcularISSSTrabajador(salarioBruto: number): number {
  if (salarioBruto >= ISSS_TOPE_SALARIO) {
    return ISSS_TOPE_TRABAJADOR;
  }
  return round2(salarioBruto * ISSS_TRABAJADOR_RATE);
}

export function calcularISSSPatronal(salarioBruto: number): number {
  if (salarioBruto >= ISSS_TOPE_SALARIO) {
    return ISSS_TOPE_PATRONAL;
  }
  return round2(salarioBruto * ISSS_PATRONAL_RATE);
}

export function calcularBaseGravableISR(
  salarioBruto: number,
  afpTrabajador: number,
  isssTrabajador: number,
): number {
  return round2(salarioBruto - afpTrabajador - isssTrabajador);
}

export function calcularISR(baseGravable: number): number {
  const bracket = ISR_TABLA_MENSUAL.find(
    (row) => baseGravable >= row.desde && baseGravable <= row.hasta,
  );

  if (!bracket || bracket.porcentaje === 0) {
    return 0;
  }

  return round2(
    (baseGravable - bracket.sobreExcedente) * bracket.porcentaje +
      bracket.cuotaFija,
  );
}

export function enrichSalaryResult(result: SalaryResult): SalaryResultComputed {
  return {
    ...result,
    salarioLiquidoMensual:
      result.salarioBruto + result.deduccionesTotalesPatronales,
    salarioLiquidoQuincenal:
      (result.salarioBruto + result.deduccionesTotalesPatronales) / 2,
  };
}

export function calcularSalario(
  salarioBruto: number,
  afpEntidad: string = DEFAULT_AFP_ENTIDAD,
): SalaryResult {
  const afpTrabajador = calcularAFPTrabajador(salarioBruto);
  const afpPatronal = calcularAFPPatronal(salarioBruto);
  const isssTrabajador = calcularISSSTrabajador(salarioBruto);
  const isssPatronal = calcularISSSPatronal(salarioBruto);
  const baseGravable = calcularBaseGravableISR(
    salarioBruto,
    afpTrabajador,
    isssTrabajador,
  );
  const renta = calcularISR(baseGravable);
  const totalDeducciones = round2(afpTrabajador + isssTrabajador + renta);
  const salarioNeto = round2(salarioBruto - totalDeducciones);
  const deduccionesTotalesPatronales = round2(afpPatronal + isssPatronal);

  return {
    salarioBruto,
    afpTrabajador,
    afpPatronal,
    isssTrabajador,
    isssPatronal,
    renta,
    salarioNeto,
    salarioNetoQuincenal: round2(salarioNeto / 2),
    totalDeducciones,
    deduccionesTotalesPatronales,
    afpEntidad,
  };
}

export function validarSalarioMinimo(salario: number): boolean {
  return salario >= SALARIO_MINIMO_INDUSTRIA;
}

export function isAfpEntidad(value: string): value is AfpEntidad {
  return value === "Crecer" || value === "Confia";
}
