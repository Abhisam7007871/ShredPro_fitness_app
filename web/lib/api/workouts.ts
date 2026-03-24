import { AiWorkoutPlanRequest, AiWorkoutPlan } from "@/types/workout";

const API_BASE = "/api/workouts/ai-plan";

export async function requestAiWorkoutPlan(
  payload: AiWorkoutPlanRequest,
): Promise<AiWorkoutPlan> {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to generate AI workout plan");
  }

  const data = await res.json();
  return { planId: data.planId, ...data.plan };
}

export async function getCurrentAiWorkoutPlan(): Promise<AiWorkoutPlan | null> {
  const res = await fetch(API_BASE, {
    method: "GET",
    credentials: "include",
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch AI workout plan");

  const data = await res.json();
  return { planId: data.planId, ...data.plan };
}

