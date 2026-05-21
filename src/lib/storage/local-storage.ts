import type {
  AppPrefs,
  CurrentSalaryStorage,
  Expense,
  SalaryHistoryEntry,
  TenureKey,
} from "@/lib/salary/types";
import { DEFAULT_AFP_ENTIDAD, DEFAULT_TENURE } from "@/lib/salary/constants";

const KEYS = {
  currentSalary: "current_salary",
  salaryHistory: "salary_history",
  expenses: "expenses",
  appPrefs: "app_prefs",
} as const;

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function getCurrentSalary(): CurrentSalaryStorage {
  return readJSON<CurrentSalaryStorage>(KEYS.currentSalary, {
    salary: 0,
    afp_entity: DEFAULT_AFP_ENTIDAD,
    tenure: DEFAULT_TENURE as TenureKey,
  });
}

export function setCurrentSalary(data: CurrentSalaryStorage): void {
  writeJSON(KEYS.currentSalary, data);
}

export function getExpenses(): Expense[] {
  return readJSON<Expense[]>(KEYS.expenses, []);
}

export function setExpenses(expenses: Expense[]): void {
  writeJSON(KEYS.expenses, expenses);
}

export function getSalaryHistory(): SalaryHistoryEntry[] {
  return readJSON<SalaryHistoryEntry[]>(KEYS.salaryHistory, []);
}

export function setSalaryHistory(entries: SalaryHistoryEntry[]): void {
  writeJSON(KEYS.salaryHistory, entries);
}

export function getAppPrefs(): AppPrefs {
  return readJSON<AppPrefs>(KEYS.appPrefs, {});
}

export function setAppPrefs(prefs: AppPrefs): void {
  writeJSON(KEYS.appPrefs, prefs);
}

export function updateAppPrefs(patch: Partial<AppPrefs>): AppPrefs {
  const next = { ...getAppPrefs(), ...patch };
  setAppPrefs(next);
  return next;
}
