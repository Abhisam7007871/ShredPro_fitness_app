"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, Loader2, Sparkles } from "lucide-react";
import api from "@/lib/api";
import Card from "@/components/ui/Card";

type TechniqueStep = { title: string; description: string };
type ExerciseTechnique = {
  exerciseId: string;
  exerciseName: string;
  summary: string;
  equipment: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  steps: TechniqueStep[];
  cues: string[];
  commonMistakes: string[];
  safety: string[];
  breathing: string;
  tempo: string;
  warmup: string[];
  cooldown: string[];
};

function cacheKey(exerciseId: string) {
  return `exercise_technique_v1:${exerciseId}`;
}

export default function ExerciseDetailPage() {
  const params = useParams<{ exerciseId: string }>();
  const exerciseId = params.exerciseId;

  const [exercise, setExercise] = useState<any>(null);
  const [technique, setTechnique] = useState<ExerciseTechnique | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingTechnique, setLoadingTechnique] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const equipmentText = useMemo(() => {
    const e = exercise?.equipment;
    if (!e) return "—";
    if (Array.isArray(e)) return e.join(", ");
    return String(e);
  }, [exercise]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    api
      .get(`/exercises/${exerciseId}`)
      .then((res) => mounted && setExercise(res.data))
      .catch(() => mounted && setError("Failed to load exercise"))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [exerciseId]);

  useEffect(() => {
    if (!exerciseId) return;
    try {
      const raw = localStorage.getItem(cacheKey(exerciseId));
      if (raw) {
        const parsed = JSON.parse(raw) as { at: number; value: ExerciseTechnique };
        if (Date.now() - parsed.at < 1000 * 60 * 60 * 24) {
          setTechnique(parsed.value);
        }
      }
    } catch {
      // ignore
    }
  }, [exerciseId]);

  const loadTechnique = async () => {
    setLoadingTechnique(true);
    setError(null);
    try {
      const res = await fetch(`/api/exercises/${exerciseId}/technique`, {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      const data = (await res.json()) as any;
      if (!res.ok) {
        throw new Error(data?.error || "Failed to generate technique");
      }
      setTechnique(data as ExerciseTechnique);
      try {
        localStorage.setItem(
          cacheKey(exerciseId),
          JSON.stringify({ at: Date.now(), value: data }),
        );
      } catch {
        // ignore
      }
    } catch (e: any) {
      setError(e?.message || "Failed to generate technique");
    } finally {
      setLoadingTechnique(false);
    }
  };

  useEffect(() => {
    if (!technique && exerciseId) {
      loadTechnique();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exerciseId]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      <div className="flex items-center gap-4 pt-4">
        <Link
          href="/dashboard/workouts"
          className="h-10 w-10 rounded-xl bg-surface-accent border border-[rgb(var(--border))] flex items-center justify-center text-text-muted hover:text-text-main hover:bg-surface transition-all"
        >
          <ChevronLeft size={20} />
        </Link>
        <div className="min-w-0">
          <p className="text-xs font-bold text-text-muted uppercase tracking-widest">
            Technique
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight truncate">
            {loading ? "Loading…" : exercise?.name ?? "Exercise"}
          </h1>
        </div>
      </div>

      {error && (
        <Card className="p-4">
          <p className="text-sm font-bold text-red-600">{error}</p>
        </Card>
      )}

      <Card className="p-6">
        {loading ? (
          <div className="flex items-center gap-3 text-text-muted">
            <Loader2 className="animate-spin" size={18} />
            Loading exercise…
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-surface-accent border border-[rgb(var(--border))] p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                Category
              </p>
              <p className="mt-2 text-sm font-extrabold text-text-main">
                {exercise?.category ?? "—"}
              </p>
            </div>
            <div className="rounded-2xl bg-surface-accent border border-[rgb(var(--border))] p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                Target
              </p>
              <p className="mt-2 text-sm font-extrabold text-text-main">
                {exercise?.targetMuscleGroups?.join(", ") || "—"}
              </p>
            </div>
            <div className="rounded-2xl bg-surface-accent border border-[rgb(var(--border))] p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                Equipment
              </p>
              <p className="mt-2 text-sm font-extrabold text-text-main">
                {equipmentText}
              </p>
            </div>
          </div>
        )}
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-text-muted">
              How to do it
            </p>
            <p className="text-lg font-extrabold text-text-main">
              AI Technique Guide
            </p>
          </div>
          <button
            type="button"
            onClick={loadTechnique}
            disabled={loadingTechnique}
            className="h-10 px-4 rounded-xl bg-primary text-white font-bold flex items-center gap-2 hover:brightness-95 disabled:opacity-60 transition-all"
          >
            {loadingTechnique ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Sparkles size={16} />
            )}
            Refresh
          </button>
        </div>

        {!technique ? (
          <div className="mt-4 text-sm text-text-muted">
            {loadingTechnique ? "Generating…" : "No technique yet."}
          </div>
        ) : (
          <div className="mt-5 space-y-6">
            <p className="text-sm text-text-muted font-semibold">
              {technique.summary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-surface-accent border border-[rgb(var(--border))] p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                  Difficulty
                </p>
                <p className="mt-2 text-sm font-extrabold text-text-main capitalize">
                  {technique.difficulty}
                </p>
              </div>
              <div className="rounded-2xl bg-surface-accent border border-[rgb(var(--border))] p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                  Breathing & tempo
                </p>
                <p className="mt-2 text-sm font-extrabold text-text-main">
                  {technique.breathing}
                </p>
                <p className="mt-1 text-xs text-text-muted font-bold">
                  Tempo: {technique.tempo}
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-text-muted">
                Steps
              </h2>
              <div className="mt-3 space-y-3">
                {technique.steps.map((s, idx) => (
                  <div
                    key={`${idx}-${s.title}`}
                    className="rounded-2xl bg-surface-accent border border-[rgb(var(--border))] p-4"
                  >
                    <p className="text-xs font-black text-text-main">
                      {idx + 1}. {s.title}
                    </p>
                    <p className="mt-2 text-sm text-text-muted font-semibold">
                      {s.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: "Cues", items: technique.cues },
                { title: "Common mistakes", items: technique.commonMistakes },
                { title: "Safety", items: technique.safety },
              ].map((b) => (
                <div
                  key={b.title}
                  className="rounded-2xl bg-surface-accent border border-[rgb(var(--border))] p-4"
                >
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                    {b.title}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {b.items.slice(0, 6).map((it, i) => (
                      <li key={i} className="text-sm text-text-main font-semibold">
                        - {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-surface-accent border border-[rgb(var(--border))] p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                  Warmup
                </p>
                <ul className="mt-3 space-y-2">
                  {(technique.warmup || []).slice(0, 6).map((it, i) => (
                    <li key={i} className="text-sm text-text-main font-semibold">
                      - {it}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-surface-accent border border-[rgb(var(--border))] p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                  Cooldown
                </p>
                <ul className="mt-3 space-y-2">
                  {(technique.cooldown || []).slice(0, 6).map((it, i) => (
                    <li key={i} className="text-sm text-text-main font-semibold">
                      - {it}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

