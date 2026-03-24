'use client';

import { useState } from "react";
import {
  requestAiWorkoutPlan,
  getCurrentAiWorkoutPlan,
} from "@/lib/api/workouts";
import type {
  AiWorkoutPlan,
  AiWorkoutPlanRequest,
  TrainingGoal,
} from "@/types/workout";

const defaultRequest: AiWorkoutPlanRequest = {
  goal: "muscle_gain",
  experienceLevel: "intermediate",
  daysPerWeek: 4,
  sessionLengthMinutes: 60,
  availableEquipment: [],
  injuriesOrConstraints: [],
  preferredSplit: "upper_lower",
};

export default function AiWorkoutPlanPage() {
  const [form, setForm] = useState<AiWorkoutPlanRequest>(defaultRequest);
  const [plan, setPlan] = useState<AiWorkoutPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof AiWorkoutPlanRequest, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value } as AiWorkoutPlanRequest));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const newPlan = await requestAiWorkoutPlan(form);
      setPlan(newPlan);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to generate plan";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentPlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const current = await getCurrentAiWorkoutPlan();
      setPlan(current);
      if (!current) setError("No AI plan found yet.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load current plan";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const goals: { value: TrainingGoal; label: string }[] = [
    { value: "muscle_gain", label: "Muscle gain" },
    { value: "fat_loss", label: "Fat loss" },
    { value: "strength", label: "Strength" },
    { value: "endurance", label: "Endurance" },
  ];

  return (
    <div className="min-h-screen bg-background text-text-main">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <header className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-heading font-semibold tracking-tight">
              AI Workout Plan
            </h1>
            <p className="mt-2 text-sm text-text-muted">
              Generate a personalized multi-week workout plan based on your
              goals and schedule.
            </p>
          </div>
          <button
            type="button"
            onClick={loadCurrentPlan}
            className="rounded-md border border-surface-accent px-3 py-2 text-sm font-medium hover:bg-surface-accent/60"
          >
            Load current plan
          </button>
        </header>

        <div className="grid gap-8 md:grid-cols-[minmax(0,1.25fr),minmax(0,1.75fr)]">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-xl border border-surface-accent bg-surface/60 p-5 shadow-sm"
          >
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
              Preferences
            </h2>

            <div className="space-y-1">
              <label className="text-xs font-medium text-text-muted">
                Primary goal
              </label>
              <select
                className="w-full rounded-md border border-surface-accent bg-background px-3 py-2 text-sm"
                value={form.goal}
                onChange={(e) =>
                  handleChange("goal", e.target.value as TrainingGoal)
                }
              >
                {goals.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-text-muted">
                Experience level
              </label>
              <select
                className="w-full rounded-md border border-surface-accent bg-background px-3 py-2 text-sm"
                value={form.experienceLevel}
                onChange={(e) =>
                  handleChange("experienceLevel", e.target.value)
                }
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="flex gap-3">
              <div className="flex-1 space-y-1">
                <label className="text-xs font-medium text-text-muted">
                  Days per week
                </label>
                <input
                  type="number"
                  min={1}
                  max={7}
                  className="w-full rounded-md border border-surface-accent bg-background px-3 py-2 text-sm"
                  value={form.daysPerWeek}
                  onChange={(e) =>
                    handleChange("daysPerWeek", Number(e.target.value))
                  }
                />
              </div>
              <div className="flex-1 space-y-1">
                <label className="text-xs font-medium text-text-muted">
                  Session length (minutes)
                </label>
                <input
                  type="number"
                  min={20}
                  max={180}
                  className="w-full rounded-md border border-surface-accent bg-background px-3 py-2 text-sm"
                  value={form.sessionLengthMinutes}
                  onChange={(e) =>
                    handleChange(
                      "sessionLengthMinutes",
                      Number(e.target.value),
                    )
                  }
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-text-muted">
                Available equipment (comma separated)
              </label>
              <input
                type="text"
                className="w-full rounded-md border border-surface-accent bg-background px-3 py-2 text-sm"
                placeholder="e.g. dumbbells, bench, pull-up bar"
                onChange={(e) =>
                  handleChange(
                    "availableEquipment",
                    e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  )
                }
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-text-muted">
                Injuries / constraints (comma separated)
              </label>
              <input
                type="text"
                className="w-full rounded-md border border-surface-accent bg-background px-3 py-2 text-sm"
                placeholder="e.g. shoulder impingement"
                onChange={(e) =>
                  handleChange(
                    "injuriesOrConstraints",
                    e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  )
                }
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-text-muted">
                Preferred split
              </label>
              <select
                className="w-full rounded-md border border-surface-accent bg-background px-3 py-2 text-sm"
                value={form.preferredSplit ?? ""}
                onChange={(e) =>
                  handleChange(
                    "preferredSplit",
                    (e.target.value || undefined) as
                      | AiWorkoutPlanRequest["preferredSplit"]
                      | undefined,
                  )
                }
              >
                <option value="full_body">Full body</option>
                <option value="upper_lower">Upper / lower</option>
                <option value="push_pull_legs">Push / Pull / Legs</option>
                <option value="custom">Custom / flexible</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-3 w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-black hover:bg-primary/90 disabled:opacity-60"
            >
              {loading ? "Generating..." : "Generate AI Workout Plan"}
            </button>

            {error && <p className="text-xs text-red-400">{error}</p>}
          </form>

          <section className="space-y-3 rounded-xl border border-surface-accent bg-surface/60 p-5">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
              Your AI plan
            </h2>
            {!plan && !error && (
              <p className="text-sm text-text-muted">
                Generate a plan or load your latest AI plan to see it here.
              </p>
            )}
            {plan && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-heading font-semibold text-text-main">
                    {plan.name}
                  </p>
                  <p className="text-xs text-text-muted">
                    {plan.durationWeeks} weeks • {plan.daysPerWeek} days /
                    week • ID {plan.planId}
                  </p>
                </div>
                <div className="max-h-[480px] space-y-3 overflow-y-auto pr-2">
                  {plan.weeks.map((week) => (
                    <div key={week.weekNumber} className="space-y-2">
                      <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                        Week {week.weekNumber}
                      </h3>
                      <div className="space-y-2">
                        {week.days.map((day) => (
                          <div
                            key={day.dayNumber}
                            className="rounded-md border border-surface-accent bg-background/60 p-3"
                          >
                            <p className="text-xs font-semibold text-text-main">
                              Day {day.dayNumber}: {day.label}
                            </p>
                            <ul className="mt-2 space-y-1">
                              {day.exercises.map((ex) => (
                                <li
                                  key={`${ex.exerciseId}-${ex.sets}-${ex.reps}`}
                                  className="text-xs text-text-main"
                                >
                                  <span className="font-medium">
                                    {ex.exerciseId}
                                  </span>{" "}
                                  – {ex.sets} x {ex.reps}
                                  {ex.rpe && <> • RPE {ex.rpe}</>}
                                  {ex.notes && (
                                    <span className="text-text-muted">
                                      {" "}
                                      – {ex.notes}
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

