import type { AFP_ENTIDADES, AGUINALDO_DIAS_POR_TENURE } from "./constants";

export type AfpEntidad = (typeof AFP_ENTIDADES)[number];
export type TenureKey = keyof typeof AGUINALDO_DIAS_POR_TENURE;

export interface IsrBracket {
  desde: number;
  hasta: number;
  porcentaje: number;
  sobreExcedente: number;
  cuotaFija: number;
}

export interface SalaryResult {
  salarioBruto: number;
  afpTrabajador: number;
  afpPatronal: number;
  isssTrabajador: number;
  isssPatronal: number;
  renta: number;
  salarioNeto: number;
  salarioNetoQuincenal: number;
  totalDeducciones: number;
  deduccionesTotalesPatronales: number;
  afpEntidad: string;
  insaforpPatronal: number;
  isFreelance: boolean;
}

export interface SalaryResultComputed extends SalaryResult {
  salarioLiquidoMensual: number;
  salarioLiquidoQuincenal: number;
}

export interface Budget503020 {
  necesidades: number;
  necesidadesQuincenal: number;
  gustos: number;
  gustosQuincenal: number;
  ahorros: number;
  ahorrosQuincenal: number;
}

export interface BenefitsProjection {
  aguinaldo: number;
  vacaciones: number;
  indemnizacion: number;
  total: number;
  tenureKey: TenureKey;
}

export type ExpenseCategory = "necesidades" | "gustos" | "ahorros";

export interface Expense {
  id: string;
  nombre: string;
  monto: number;
  categoria: ExpenseCategory;
  descripcion?: string;
  fechaCreacion: string;
  esRecurrente: boolean;
  icono?: string;
}

export interface BudgetSummary {
  presupuestoNecesidades: number;
  presupuestoGustos: number;
  presupuestoAhorros: number;
  totalNecesidades: number;
  totalGustos: number;
  totalAhorros: number;
  saldoRestante: number;
  diferenciaNecesidades: number;
  diferenciaGustos: number;
  diferenciaAhorros: number;
  porcentajeNecesidades: number;
  porcentajeGustos: number;
  porcentajeAhorros: number;
  estaDentroPresupuesto: boolean;
}

export interface SalaryHistoryEntry {
  id: string;
  salarioBruto: number;
  salarioNeto: number;
  salarioNetoQuincenal: number;
  afpTrabajador: number;
  isssTrabajador: number;
  renta: number;
  totalDeducciones: number;
  afpEntidad: string;
  fecha: string;
  nota?: string;
  title?: string;
  tenure?: TenureKey;
}

export interface DistributionPctStorage {
  necesidades: number;
  gustos: number;
  ahorros: number;
}

export interface CurrentSalaryStorage {
  salary: number;
  afp_entity: string;
  tenure: TenureKey;
  simulated_net_salary?: number;
  distribution_pct?: DistributionPctStorage;
  mode?: "bruto_a_neto" | "neto_a_bruto";
  contract_type?: "planilla" | "servicios";
  view_perspective?: "empleado" | "empleador";
  include_insaforp?: boolean;
}

export interface AppPrefs {
  budget_edu_banner_dismissed?: boolean;
  accent?: string;
}
