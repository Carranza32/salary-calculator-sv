"use client";

import { useEffect, useState } from "react";
import {
  ACCENT_PRESETS,
  DEFAULT_ACCENT,
  isAccentPreset,
  type AccentPreset,
} from "@/lib/theme/presets";
import { getAppPrefs, updateAppPrefs } from "@/lib/storage/local-storage";
import { cn } from "@/lib/utils";

export function ThemeAccentPicker() {
  const [active, setActive] = useState<AccentPreset>(DEFAULT_ACCENT);

  useEffect(() => {
    const prefs = getAppPrefs();
    const fromDom = document.documentElement.getAttribute("data-accent");
    const id =
      (fromDom && isAccentPreset(fromDom) ? fromDom : null) ??
      (prefs.accent && isAccentPreset(prefs.accent) ? prefs.accent : DEFAULT_ACCENT);
    setTimeout(() => {
      setActive(id);
    }, 0);
  }, []);

  const apply = (accent: AccentPreset) => {
    document.documentElement.setAttribute("data-accent", accent);
    updateAppPrefs({ accent });
    setActive(accent);
  };

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Color de acento">
      {(Object.keys(ACCENT_PRESETS) as AccentPreset[]).map((id) => (
        <button
          key={id}
          type="button"
          title={ACCENT_PRESETS[id].label}
          aria-label={ACCENT_PRESETS[id].label}
          aria-pressed={active === id}
          onClick={() => apply(id)}
          className={cn(
            "h-8 w-8 rounded-full border-2 transition-transform hover:scale-110",
            active === id ? "border-foreground scale-110" : "border-transparent",
          )}
          style={{ background: ACCENT_PRESETS[id].primary }}
        />
      ))}
    </div>
  );
}
