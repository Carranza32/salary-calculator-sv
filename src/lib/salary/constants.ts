/**
 * Constantes normativas El Salvador 2026.
 * Única fuente de verdad para porcentajes, topes e ISR.
 */

// Porcentajes AFP / ISSS
export const AFP_TRABAJADOR_RATE = 0.0725;
export const AFP_PATRONAL_RATE = 0.0875;
export const ISSS_TRABAJADOR_RATE = 0.03;
export const ISSS_PATRONAL_RATE = 0.075;

// Topes ISSS (salario base máx. $1,000)
export const ISSS_TOPE_SALARIO = 1000;
export const ISSS_TOPE_TRABAJADOR = 30;
export const ISSS_TOPE_PATRONAL = 75;

// Insaforp (1% patronal con tope de $1,000)
export const INSAFORP_RATE = 0.01;
export const INSAFORP_TOPE_SALARIO = 1000;

// Salarios mínimos 2026 (referencia)
export const SALARIO_MINIMO_INDUSTRIA = 408.8;
export const SALARIO_MINIMO_MAQUILA = 402.26;
export const SALARIO_MINIMO_AGRICOLA = 272.72;

// Regla 50/30/20
export const BUCKET_NECESIDADES_RATE = 0.5;
export const BUCKET_GUSTOS_RATE = 0.3;
export const BUCKET_AHORROS_RATE = 0.2;

// Tabla ISR mensual (Decreto vigente 2026)
export const ISR_TABLA_MENSUAL = [
  {
    desde: 0.01,
    hasta: 550.0,
    porcentaje: 0,
    sobreExcedente: 0,
    cuotaFija: 0,
  },
  {
    desde: 550.01,
    hasta: 895.24,
    porcentaje: 0.1,
    sobreExcedente: 550.0,
    cuotaFija: 17.67,
  },
  {
    desde: 895.25,
    hasta: 2038.1,
    porcentaje: 0.2,
    sobreExcedente: 895.24,
    cuotaFija: 60.0,
  },
  {
    desde: 2038.11,
    hasta: Infinity,
    porcentaje: 0.3,
    sobreExcedente: 2038.1,
    cuotaFija: 288.57,
  },
] as const;

// Días de aguinaldo por antigüedad
export const AGUINALDO_DIAS_POR_TENURE = {
  menos_1: 7,
  "1_3": 15,
  "3_10": 19,
  mas_10: 21,
} as const;

// Años estimados para indemnización por tramo de antigüedad
export const INDEMNIZACION_ANIOS_POR_TENURE = {
  menos_1: 0.5,
  "1_3": 2,
  "3_10": 6.5,
  mas_10: 12,
} as const;

export const VACACIONES_DIAS = 15;
export const VACACIONES_PRIMA_RATE = 0.3;
export const INDEMNIZACION_DIAS_MINIMOS = 15;
export const DIAS_MES_SALARIO = 30;

export const AFP_ENTIDADES = ["Crecer", "Confia"] as const;
export const DEFAULT_AFP_ENTIDAD = "Crecer";
export const DEFAULT_TENURE = "1_3";
