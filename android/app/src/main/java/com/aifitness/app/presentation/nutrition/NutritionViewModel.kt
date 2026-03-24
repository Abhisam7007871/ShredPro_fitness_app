package com.aifitness.app.presentation.nutrition

import com.aifitness.app.data.repository.mock.MockNutritionRepository

class NutritionViewModel(
    private val repository: MockNutritionRepository = MockNutritionRepository()
) {
    fun loadDay(): NutritionDay = repository.getDay()
}

