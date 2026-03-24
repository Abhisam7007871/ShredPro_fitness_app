"use client";

import { useMemo, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Droplets, Flame, PieChart, Sparkles, Loader2 } from "lucide-react";
import Card from "@/components/ui/Card";
import ProgressRing from "@/components/ui/ProgressRing";
import SegmentedTabs from "@/components/ui/SegmentedTabs";
import { getNutritionDay } from "@/lib/data/nutrition";
import { getNutritionPrefs } from "@/lib/prefs/nutritionPrefs";

export default function NutritionTracker() {
    const { data: session } = useSession();
    const userId = (session?.user as any)?.id as string | undefined;

    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState<"today" | "weekly" | "monthly">("today");
    const [day, setDay] = useState<any>(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState<string | null>(null);
    const [aiDay, setAiDay] = useState<any>(null);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        getNutritionDay(userId)
            .then((d) => mounted && setDay(d))
            .finally(() => mounted && setLoading(false));
        return () => {
            mounted = false;
        };
    }, [userId, range]);

    useEffect(() => {
        try {
            const raw = localStorage.getItem("ai_nutrition_day_v1");
            if (raw) {
                const parsed = JSON.parse(raw) as { at: number; value: any };
                if (Date.now() - parsed.at < 1000 * 60 * 60 * 24) {
                    setAiDay(parsed.value);
                }
            }
        } catch {
            // ignore
        }
    }, []);

    const activeDay = aiDay ?? day;

    const consumed = activeDay?.consumed ?? { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 };
    const targets = activeDay?.targets ?? { calories: 1, proteinG: 1, carbsG: 1, fatG: 1 };

    const caloriesRemaining = Math.max(0, targets.calories - consumed.calories);
    const caloriesProgress = useMemo(() => Math.min(1, consumed.calories / targets.calories), [consumed, targets]);

    const generateAiPlan = async () => {
        setAiLoading(true);
        setAiError(null);
        try {
            const prefs = getNutritionPrefs();
            const res = await fetch("/api/nutrition/ai-plan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    region: prefs.region,
                    dietType: prefs.dietType,
                    caloriesTarget: targets.calories,
                    mealsPerDay: 3,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || "Failed to generate plan");
            setAiDay(data);
            try {
                localStorage.setItem("ai_nutrition_day_v1", JSON.stringify({ at: Date.now(), value: data }));
            } catch {
                // ignore
            }
        } catch (e: any) {
            setAiError(e?.message || "Failed to generate plan");
        } finally {
            setAiLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-24">
            <div className="flex items-center justify-between pt-4">
                <div>
                    <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Daily meals</p>
                    <h1 className="text-2xl font-extrabold tracking-tight">Nutrition</h1>
                </div>
                <Link href="/dashboard/profile" className="h-10 px-4 rounded-xl bg-surface-accent border border-[rgb(var(--border))] flex items-center justify-center text-text-main hover:bg-surface transition-all gap-2 text-sm font-bold">
                    <Sparkles size={16} className="text-primary" />
                    Preferences
                </Link>
            </div>

            <SegmentedTabs
                value={range}
                options={[
                    { value: "today", label: "Today" },
                    { value: "weekly", label: "Weekly" },
                    { value: "monthly", label: "Monthly" },
                ]}
                onChange={setRange}
            />

            <Card className="p-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest text-text-muted">AI regional plan</p>
                        <p className="text-lg font-extrabold text-text-main">Meals based on your region</p>
                        <p className="mt-1 text-sm text-text-muted font-semibold">
                            Set your Region + Diet type in Profile, then generate a plan.
                        </p>
                        {aiError && <p className="mt-2 text-sm font-bold text-red-600">{aiError}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                        {aiDay && (
                            <button
                                type="button"
                                onClick={() => {
                                    setAiDay(null);
                                    try { localStorage.removeItem("ai_nutrition_day_v1"); } catch { }
                                }}
                                className="h-10 px-4 rounded-xl bg-surface border border-[rgb(var(--border))] text-text-main font-bold hover:bg-surface-accent transition-all"
                            >
                                Use default
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={generateAiPlan}
                            disabled={aiLoading}
                            className="h-10 px-4 rounded-xl bg-primary text-white font-bold hover:brightness-95 transition-all disabled:opacity-60 flex items-center gap-2"
                        >
                            {aiLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                            Generate
                        </button>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="p-6 lg:col-span-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-text-muted">Calories</p>
                            <p className="text-sm text-text-muted font-semibold">Remaining</p>
                        </div>
                        <span className="text-xs font-bold text-text-muted">
                            {loading ? "…" : `${consumed.calories} / ${targets.calories}`}
                        </span>
                    </div>
                    <div className="mt-6 flex items-center justify-center">
                        <ProgressRing progress={caloriesProgress} label={loading ? "…" : caloriesRemaining} sublabel="Remaining" />
                    </div>
                </Card>

                <div className="space-y-4">
                    {[
                        { label: "Protein", val: consumed.proteinG, target: targets.proteinG, icon: PieChart, color: "text-primary" },
                        { label: "Carbs", val: consumed.carbsG, target: targets.carbsG, icon: Flame, color: "text-blue-400" },
                        { label: "Fat", val: consumed.fatG, target: targets.fatG, icon: Droplets, color: "text-amber-400" },
                    ].map((m) => (
                        <Card key={m.label} className="p-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`h-10 w-10 rounded-xl bg-surface-accent border border-[rgb(var(--border))] flex items-center justify-center ${m.color}`}>
                                        <m.icon size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">{m.label}</p>
                                        <p className="text-lg font-extrabold text-text-main">{loading ? "…" : `${m.val}g`}</p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-text-muted">/{m.target}g</span>
                            </div>
                            <div className="mt-3 h-1 w-full bg-surface-accent rounded-full overflow-hidden">
                                <div className="h-full bg-primary/25" style={{ width: `${Math.min(100, (m.val / Math.max(1, m.target)) * 100)}%` }} />
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-black uppercase tracking-widest text-text-muted">Meals</h2>
                    <span className="text-xs text-text-muted">{loading ? "…" : `Total: ${consumed.calories} kcal`}</span>
                </div>
                <div className="space-y-3">
                    {(activeDay?.meals ?? []).map((meal: any) => (
                        <Link
                            key={meal.id}
                            href={`/dashboard/nutrition/meals/${meal.id}`}
                            className="block rounded-2xl bg-surface-accent border border-[rgb(var(--border))] p-4 hover:bg-surface transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-text-muted">{meal.timeLabel}</p>
                                    <p className="text-sm font-extrabold text-text-main">{meal.title}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-text-main">{meal.calories} kcal</p>
                                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                                        P {meal.proteinG}g • C {meal.carbsG}g • F {meal.fatG}g
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                    {!loading && (day?.meals?.length ?? 0) === 0 && (
                        <p className="text-sm text-text-muted">No meals logged yet.</p>
                    )}
                </div>
            </Card>
        </div>
    );
}
