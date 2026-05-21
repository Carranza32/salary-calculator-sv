const currencyFormatter = new Intl.NumberFormat("es-SV", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

/** Formato visual del input de salario (miles + decimales opcionales). */
export function formatSalaryInputDisplay(raw: string): string {
  if (!raw) return "";
  const [intPart = "", decPart] = raw.split(".");
  const intDigits = intPart.replace(/\D/g, "");
  if (!intDigits && !decPart) return raw.startsWith(".") ? "0." : "";
  const formattedInt = intDigits
    ? Number(intDigits).toLocaleString("en-US")
    : "0";
  if (decPart !== undefined) {
    return `${formattedInt}.${decPart.replace(/\D/g, "").slice(0, 2)}`;
  }
  return formattedInt;
}

/** Sanitiza entrada: solo dígitos y un punto decimal (máx. 2 decimales). */
export function sanitizeSalaryInput(value: string): string {
  let cleaned = value.replace(/[^\d.]/g, "");
  const dotIndex = cleaned.indexOf(".");
  if (dotIndex !== -1) {
    const before = cleaned.slice(0, dotIndex);
    const after = cleaned.slice(dotIndex + 1).replace(/\./g, "");
    cleaned = `${before}.${after.slice(0, 2)}`;
  }
  return cleaned;
}

export function parseSalaryInput(value: string): number {
  const sanitized = sanitizeSalaryInput(value);
  if (!sanitized || sanitized === ".") return 0;
  return parseFloat(sanitized) || 0;
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-SV", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
