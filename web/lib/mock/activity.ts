export type ActivitySummary = {
  dateISO: string;
  caloriesGoal: number;
  caloriesConsumed: number;
  steps: number;
  stepsGoal: number;
  waterLiters: number;
  waterGoalLiters: number;
  heartRateBpm: number;
  sleepMinutes: number;
};

export function mockActivitySummary(): ActivitySummary {
  return {
    dateISO: new Date().toISOString(),
    caloriesGoal: 2200,
    caloriesConsumed: 1450,
    steps: 2717,
    stepsGoal: 8000,
    waterLiters: 1.8,
    waterGoalLiters: 2.5,
    heartRateBpm: 123,
    sleepMinutes: 8 * 60 + 40,
  };
}

