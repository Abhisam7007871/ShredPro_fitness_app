"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import {
  DIET_TYPES,
  DietType,
  getNutritionPrefs,
  NutritionPrefs,
  REGIONS,
  setNutritionPrefs,
  SupportedRegion,
} from "@/lib/prefs/nutritionPrefs";

export default function ProfilePage() {
  const [prefs, setPrefs] = useState<NutritionPrefs>(() => ({
    region: "US",
    dietType: "Omnivore",
  }));

  const locale = useMemo(() => {
    if (typeof window === "undefined") return "en-US";
    return (
      (navigator as any)?.language ||
      (Intl.DateTimeFormat().resolvedOptions().locale as string) ||
      "en-US"
    );
  }, []);

  useEffect(() => {
    setPrefs(getNutritionPrefs());
  }, []);

  const update = (next: NutritionPrefs) => {
    setPrefs(next);
    try {
      setNutritionPrefs(next);
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      <div className="pt-4">
        <p className="text-xs font-bold text-text-muted uppercase tracking-widest">
          Profile
        </p>
        <h1 className="text-2xl font-extrabold tracking-tight">Preferences</h1>
      </div>

      <Card className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-extrabold text-text-main">Nutrition</p>
            <p className="text-xs text-text-muted font-bold mt-1">
              Region-based meal suggestions for your diet plan.
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">
              Detected locale
            </p>
            <p className="text-sm font-extrabold text-text-main">{locale}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-surface-accent border border-[rgb(var(--border))] p-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">
              Region
            </p>
            <select
              className="mt-2 w-full h-11 rounded-xl bg-surface border border-[rgb(var(--border))] px-3 text-sm font-bold text-text-main outline-none"
              value={prefs.region}
              onChange={(e) =>
                update({
                  ...prefs,
                  region: e.target.value as SupportedRegion,
                })
              }
            >
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-2xl bg-surface-accent border border-[rgb(var(--border))] p-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">
              Diet type
            </p>
            <select
              className="mt-2 w-full h-11 rounded-xl bg-surface border border-[rgb(var(--border))] px-3 text-sm font-bold text-text-main outline-none"
              value={prefs.dietType}
              onChange={(e) =>
                update({
                  ...prefs,
                  dietType: e.target.value as DietType,
                })
              }
            >
              {DIET_TYPES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="mt-4 text-xs text-text-muted font-semibold">
          These preferences are saved on this device/browser for now.
        </p>
      </Card>
    </div>
  );
}
