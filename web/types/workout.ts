export type TrainingGoal = "muscle_gain" | "fat_loss" | "strength" | "endurance";

export interface AiWorkoutPlanRequest {
  goal: TrainingGoal;
  experienceLevel: "beginner" | "intermediate" | "advanced";
  daysPerWeek: number;
  sessionLengthMinutes: number;
  availableEquipment: string[];
  injuriesOrConstraints?: string[];
  preferredSplit?: "full_body" | "upper_lower" | "push_pull_legs" | "custom";
}

export interface AiWorkoutExercise {
  exerciseId: string;
  sets: number;
  reps: string;
  rpe?: number;
  notes?: string;
}

export interface AiWorkoutDay {
  dayNumber: number;
  label: string;
  exercises: AiWorkoutExercise[];
}

export interface AiWorkoutWeek {
  weekNumber: number;
  days: AiWorkoutDay[];
}

export interface AiWorkoutPlan {
  planId: string;
  name: string;
  durationWeeks: number;
  daysPerWeek: number;
  weeks: AiWorkoutWeek[];
}

