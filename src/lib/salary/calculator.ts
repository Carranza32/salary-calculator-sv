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

export function enrichSalaryResult(
  result: SalaryResult,
  includeInsaforp = false,
): SalaryResultComputed {
  const patronalTotal =
    result.deduccionesTotalesPatronales +
    (includeInsaforp ? result.insaforpPatronal : 0);

  return {
    ...result,
    salarioLiquidoMensual: result.salarioBruto + patronalTotal,
    salarioLiquidoQuincenal: (result.salarioBruto + patronalTotal) / 2,
  };
}

export function calcularSalario(
  salarioBruto: number,
  afpEntidad: string = DEFAULT_AFP_ENTIDAD,
  isFreelance = false,
): SalaryResult {
  if (isFreelance) {
    const renta = round2(salarioBruto * 0.1);
    const salarioNeto = round2(salarioBruto - renta);
    return {
      salarioBruto,
      afpTrabajador: 0,
      afpPatronal: 0,
      isssTrabajador: 0,
      isssPatronal: 0,
      renta,
      salarioNeto,
      salarioNetoQuincenal: round2(salarioNeto / 2),
      totalDeducciones: renta,
      deduccionesTotalesPatronales: 0,
      afpEntidad,
      insaforpPatronal: 0,
      isFreelance: true,
    };
  }

  const afpTrabajador = calcularAFPTrabajador(salarioBruto);
  const afpPatronal = calcularAFPPatronal(salarioBruto);
  const isssTrabajador = calcularISSSTrabajador(salarioBruto);
  const isssPatronal = calcularISSSPatronal(salarioBruto);
  
  // Insaforp is 1% patronal with ceiling of $1,000
  const insaforpPatronal = round2(Math.min(salarioBruto, 1000) * 0.01);

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
    insaforpPatronal,
    isFreelance: false,
  };
}

export function calcularSalarioInverso(
  salarioNetoDeseado: number,
  afpEntidad: string = DEFAULT_AFP_ENTIDAD,
  isFreelance = false,
): SalaryResult {
  if (salarioNetoDeseado <= 0) {
    return calcularSalario(0, afpEntidad, isFreelance);
  }

  if (isFreelance) {
    // Net = Gross * 0.9 => Gross = Net / 0.9
    const bruto = round2(salarioNetoDeseado / 0.9);
    return calcularSalario(bruto, afpEntidad, true);
  }

  // Binary search for Gross Salary
  let low = salarioNetoDeseado;
  let high = Math.max(salarioNetoDeseado * 2, 50000);
  let mid = 0;
  let iterations = 0;

  while (high - low > 0.0001 && iterations < 100) {
    mid = (low + high) / 2;
    const res = calcularSalario(mid, afpEntidad, false);
    if (res.salarioNeto < salarioNetoDeseado) {
      low = mid;
    } else {
      high = mid;
    }
    iterations++;
  }

  return calcularSalario(round2(mid), afpEntidad, false);
}

export function validarSalarioMinimo(salario: number): boolean {
  return salario >= SALARIO_MINIMO_INDUSTRIA;
}

export function isAfpEntidad(value: string): value is AfpEntidad {
  return value === "Crecer" || value === "Confia";
}
