package com.aifitness.app.presentation.nutrition

data class MacroTargets(
    val calories: Int,
    val proteinG: Int,
    val carbsG: Int,
    val fatG: Int
)

data class Meal(
    val id: String,
    val title: String,
    val timeLabel: String,
    val calories: Int,
    val proteinG: Int,
    val carbsG: Int,
    val fatG: Int
)

data class NutritionDay(
    val targets: MacroTargets,
    val consumed: MacroTargets,
    val meals: List<Meal>
)

