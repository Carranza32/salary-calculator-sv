import { describe, expect, it } from "vitest";
import {
  adjustDistribution,
  DEFAULT_DISTRIBUTION,
  getDistributionDiagnostic,
} from "../src/lib/salary/distribution";

describe("distribution", () => {
  it("sliders siempre suman 100%", () => {
    const next = adjustDistribution(DEFAULT_DISTRIBUTION, "necesidades", 60);
    expect(next.necesidades + next.gustos + next.ahorros).toBe(100);
  });

  it("diagnóstico saludable con ahorro >= 15%", () => {
    const d = getDistributionDiagnostic({
      necesidades: 50,
      gustos: 30,
      ahorros: 20,
    });
    expect(d.status).toBe("saludable");
  });

  it("diagnóstico en riesgo con ahorro < 5%", () => {
    const d = getDistributionDiagnostic({
      necesidades: 70,
      gustos: 28,
      ahorros: 2,
    });
    expect(d.status).toBe("en_riesgo");
  });
});
