package com.aifitness.app.presentation.nutrition

class NutritionScreen(
    private val viewModel: NutritionViewModel = NutritionViewModel()
) {
    fun render(): NutritionDay = viewModel.loadDay()
}

