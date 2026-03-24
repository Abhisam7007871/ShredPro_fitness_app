package com.aifitness.app.data.repository.mock

import com.aifitness.app.presentation.nutrition.MacroTargets
import com.aifitness.app.presentation.nutrition.Meal
import com.aifitness.app.presentation.nutrition.NutritionDay

class MockNutritionRepository {
    fun getDay(): NutritionDay {
        return NutritionDay(
            targets = MacroTargets(calories = 2200, proteinG = 180, carbsG = 220, fatG = 70),
            consumed = MacroTargets(calories = 1450, proteinG = 110, carbsG = 140, fatG = 38),
            meals = listOf(
                Meal(
                    id = "breakfast-1",
                    title = "Kiwi Smoothie Bowl with Granola",
                    timeLabel = "Breakfast",
                    calories = 450,
                    proteinG = 20,
                    carbsG = 140,
                    fatG = 12
                ),
                Meal(
                    id = "lunch-1",
                    title = "Veggie stir-fry with tofu",
                    timeLabel = "Lunch",
                    calories = 400,
                    proteinG = 30,
                    carbsG = 45,
                    fatG = 14
                ),
                Meal(
                    id = "dinner-1",
                    title = "Chicken rice bowl",
                    timeLabel = "Dinner",
                    calories = 350,
                    proteinG = 35,
                    carbsG = 40,
                    fatG = 10
                )
            )
        )
    }
}

