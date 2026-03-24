package com.aifitness.app.presentation.activity

data class ActivitySummary(
    val caloriesGoal: Int,
    val caloriesConsumed: Int,
    val steps: Int,
    val stepsGoal: Int,
    val waterLiters: Double,
    val waterGoalLiters: Double,
    val heartRateBpm: Int,
    val sleepMinutes: Int
)

