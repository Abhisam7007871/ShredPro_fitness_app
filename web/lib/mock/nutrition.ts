export type MacroTargets = {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
};

export type Meal = {
  id: string;
  title: string;
  timeLabel: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
};

export type NutritionDay = {
  dateISO: string;
  targets: MacroTargets;
  consumed: MacroTargets;
  meals: Meal[];
};

export function mockNutritionDay(): NutritionDay {
  return {
    dateISO: new Date().toISOString(),
    targets: { calories: 2200, proteinG: 180, carbsG: 220, fatG: 70 },
    consumed: { calories: 1450, proteinG: 110, carbsG: 140, fatG: 38 },
    meals: [
      {
        id: "breakfast-1",
        title: "Kiwi Smoothie Bowl with Granola",
        timeLabel: "Breakfast",
        calories: 450,
        proteinG: 20,
        carbsG: 140,
        fatG: 12,
      },
      {
        id: "lunch-1",
        title: "Veggie stir-fry with tofu",
        timeLabel: "Lunch",
        calories: 400,
        proteinG: 30,
        carbsG: 45,
        fatG: 14,
      },
      {
        id: "dinner-1",
        title: "Chicken rice bowl",
        timeLabel: "Dinner",
        calories: 350,
        proteinG: 35,
        carbsG: 40,
        fatG: 10,
      },
    ],
  };
}

