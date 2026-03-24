"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { ChevronLeft, Flame } from "lucide-react";
import Card from "@/components/ui/Card";
import { getMealById } from "@/lib/data/nutrition";

export default function MealDetailPage() {
  const params = useParams<{ mealId: string }>();
  const mealId = params.mealId;
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id as string | undefined;

  const [loading, setLoading] = useState(true);
  const [meal, setMeal] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getMealById(userId, mealId)
      .then((m) => mounted && setMeal(m))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [userId, mealId]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      <div className="flex items-center gap-4 pt-4">
        <Link
          href="/dashboard/nutrition"
          className="h-10 w-10 rounded-xl bg-surface-accent border border-[rgb(var(--border))] flex items-center justify-center text-text-muted hover:text-text-main hover:bg-surface transition-all"
        >
          <ChevronLeft size={20} />
        </Link>
        <div>
          <p className="text-xs font-bold text-text-muted uppercase tracking-widest">
            Meal detail
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight">
            {loading ? "Loading…" : meal?.title ?? "Meal"}
          </h1>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-text-muted">
              {meal?.timeLabel ?? "—"}
            </p>
            <p className="text-sm text-text-muted mt-1">
              Adjust quantities and logging will be added next.
            </p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Flame size={18} />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Calories", value: meal?.calories, unit: "kcal" },
            { label: "Protein", value: meal?.proteinG, unit: "g" },
            { label: "Carbs", value: meal?.carbsG, unit: "g" },
            { label: "Fat", value: meal?.fatG, unit: "g" },
          ].map((m) => (
            <div
              key={m.label}
              className="rounded-2xl bg-surface-accent border border-[rgb(var(--border))] p-4"
            >
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                {m.label}
              </p>
              <p className="mt-2 text-xl font-extrabold text-text-main">
                {loading ? "…" : m.value ?? 0}{" "}
                <span className="text-xs text-text-muted font-bold">{m.unit}</span>
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

