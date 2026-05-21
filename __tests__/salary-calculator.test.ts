import { describe, expect, it } from "vitest";
import {
  calcular503020,
  calcularAhorroAutomatico,
  calcularBudgetSummary,
  calcularISR,
  calcularISSSPatronal,
  calcularISSSTrabajador,
  calcularSalario,
} from "../src/lib/salary";
import type { Expense } from "../src/lib/salary/types";

describe("salary calculator", () => {
  it("$500 → ISR = 0 (tramo exento)", () => {
    const result = calcularSalario(500);
    expect(result.renta).toBe(0);
    expect(result.isssTrabajador).toBe(15);
  });

  it("$1,000 → ISSS trabajador $30, patronal $75", () => {
    expect(calcularISSSTrabajador(1000)).toBe(30);
    expect(calcularISSSPatronal(1000)).toBe(75);
    const result = calcularSalario(1000);
    expect(result.isssTrabajador).toBe(30);
    expect(result.isssPatronal).toBe(75);
  });

  it("$1,500 → ISSS topado; ISR según base gravable", () => {
    const result = calcularSalario(1500);
    expect(result.isssTrabajador).toBe(30);
    expect(result.isssPatronal).toBe(75);
    const base = 1500 - result.afpTrabajador - result.isssTrabajador;
    expect(result.renta).toBeCloseTo(calcularISR(base), 2);
  });

  it("$2,500 → tramo ISR 30%", () => {
    const result = calcularSalario(2500);
    const base = 2500 - result.afpTrabajador - result.isssTrabajador;
    expect(base).toBeGreaterThan(2038.1);
    expect(result.renta).toBeCloseTo((base - 2038.1) * 0.3 + 288.57, 2);
  });

  it("salarioNeto = bruto - afp - isss - renta", () => {
    for (const bruto of [500, 1000, 1500, 2500, 3200]) {
      const r = calcularSalario(bruto);
      expect(r.salarioNeto).toBeCloseTo(
        bruto - r.afpTrabajador - r.isssTrabajador - r.renta,
        2,
      );
    }
  });

  it("neto $1,200 → 50/30/20 = 600 / 360 / 240", () => {
    const buckets = calcular503020(1200);
    expect(buckets.necesidades).toBe(600);
    expect(buckets.gustos).toBe(360);
    expect(buckets.ahorros).toBe(240);
  });

  it("presupuesto: gastos 400+300 en neto 1000 → ahorro auto = 300", () => {
    const gastos: Expense[] = [
      {
        id: "1",
        nombre: "Renta",
        monto: 400,
        categoria: "necesidades",
        fechaCreacion: new Date().toISOString(),
        esRecurrente: true,
      },
      {
        id: "2",
        nombre: "Ocio",
        monto: 300,
        categoria: "gustos",
        fechaCreacion: new Date().toISOString(),
        esRecurrente: true,
      },
    ];
    expect(calcularAhorroAutomatico(1000, 400, 300)).toBe(300);
    const summary = calcularBudgetSummary(1000, gastos);
    expect(summary.totalAhorros).toBe(300);
  });
});
