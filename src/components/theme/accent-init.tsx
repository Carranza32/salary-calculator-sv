"use client";

import { useEffect } from "react";
import {
  DEFAULT_ACCENT,
  isAccentPreset,
  type AccentPreset,
} from "@/lib/theme/presets";
import { getAppPrefs, updateAppPrefs } from "@/lib/storage/local-storage";

export function AccentInit() {
  useEffect(() => {
    const prefs = getAppPrefs();
    const accent: AccentPreset =
      prefs.accent && isAccentPreset(prefs.accent) ? prefs.accent : DEFAULT_ACCENT;
    document.documentElement.setAttribute("data-accent", accent);
    if (!prefs.accent) {
      updateAppPrefs({ accent });
    }
  }, []);

  return null;
}
