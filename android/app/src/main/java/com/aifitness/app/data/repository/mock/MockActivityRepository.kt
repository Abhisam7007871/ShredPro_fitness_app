package com.aifitness.app.data.repository.mock

import com.aifitness.app.presentation.activity.ActivitySummary

class MockActivityRepository {
    fun getSummary(): ActivitySummary {
        return ActivitySummary(
            caloriesGoal = 2200,
            caloriesConsumed = 1450,
            steps = 2717,
            stepsGoal = 8000,
            waterLiters = 1.8,
            waterGoalLiters = 2.5,
            heartRateBpm = 123,
            sleepMinutes = 8 * 60 + 40
        )
    }
}

