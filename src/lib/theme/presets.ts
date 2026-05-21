export type AccentPreset = "teal" | "blue" | "violet" | "amber";

export interface AccentTheme {
  id: AccentPreset;
  label: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  ring: string;
}

export const ACCENT_PRESETS: Record<AccentPreset, AccentTheme> = {
  teal: {
    id: "teal",
    label: "Verde azulado",
    primary: "oklch(0.45 0.08 180)",
    primaryForeground: "oklch(0.98 0.01 180)",
    secondary: "oklch(0.92 0.03 180)",
    ring: "oklch(0.45 0.08 180)",
  },
  blue: {
    id: "blue",
    label: "Azul",
    primary: "oklch(0.49 0.15 250)",
    primaryForeground: "oklch(0.98 0.01 250)",
    secondary: "oklch(0.92 0.04 250)",
    ring: "oklch(0.49 0.15 250)",
  },
  violet: {
    id: "violet",
    label: "Violeta",
    primary: "oklch(0.5 0.18 300)",
    primaryForeground: "oklch(0.98 0.01 300)",
    secondary: "oklch(0.92 0.05 300)",
    ring: "oklch(0.5 0.18 300)",
  },
  amber: {
    id: "amber",
    label: "Ámbar",
    primary: "oklch(0.62 0.15 75)",
    primaryForeground: "oklch(0.2 0.04 75)",
    secondary: "oklch(0.93 0.05 75)",
    ring: "oklch(0.62 0.15 75)",
  },
};

export const DEFAULT_ACCENT: AccentPreset = "teal";

export function isAccentPreset(value: string): value is AccentPreset {
  return value in ACCENT_PRESETS;
}
