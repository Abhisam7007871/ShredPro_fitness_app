import api from "@/lib/api";
import { NutritionDay, mockNutritionDay } from "@/lib/mock/nutrition";

export async function getNutritionDay(userId?: string): Promise<NutritionDay> {
  const useMock = process.env.NEXT_PUBLIC_USE_MOCK === "1";
  if (useMock || !userId) return mockNutritionDay();

  try {
    const res = await api.get(`/diet/day?userId=${userId}`);
    return res.data as NutritionDay;
  } catch {
    return mockNutritionDay();
  }
}

export async function getMealById(
  userId: string | undefined,
  mealId: string,
): Promise<NutritionDay["meals"][number] | null> {
  const day = await getNutritionDay(userId);
  return day.meals.find((m) => m.id === mealId) ?? null;
}

