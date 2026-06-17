"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useSalaryStore } from "@/stores/salary-store";
import type { TenureKey } from "@/lib/salary/types";

export function QueryParamHydrator() {
  const searchParams = useSearchParams();
  const setSalary = useSalaryStore((s) => s.setSalary);
  const setAfpEntity = useSalaryStore((s) => s.setAfpEntity);
  const setTenure = useSalaryStore((s) => s.setTenure);
  const hydrated = useSalaryStore((s) => s.hydrated);
  const initialized = useRef(false);

  useEffect(() => {
    if (!hydrated || initialized.current) return;

    const s = searchParams?.get("s");
    const afp = searchParams?.get("afp");
    const ant = searchParams?.get("ant");

    let changed = false;

    if (s) {
      const parsedSalary = parseFloat(s);
      if (!isNaN(parsedSalary) && parsedSalary > 0) {
        setSalary(parsedSalary);
        changed = true;
      }
    }

    if (afp) {
      // Validate that it matches either "Crecer" or "Confia"
      if (afp === "Crecer" || afp === "Confia") {
        setAfpEntity(afp);
        changed = true;
      }
    }

    if (ant) {
      // Validate that it is a valid TenureKey
      if (
        ant === "menos_1" ||
        ant === "1_3" ||
        ant === "3_10" ||
        ant === "mas_10"
      ) {
        setTenure(ant as TenureKey);
        changed = true;
      }
    }

    if (changed) {
      initialized.current = true;
    }
  }, [searchParams, hydrated, setSalary, setAfpEntity, setTenure]);

  return null;
}
export default QueryParamHydrator;
