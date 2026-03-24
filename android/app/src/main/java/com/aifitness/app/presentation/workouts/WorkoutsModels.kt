package com.aifitness.app.presentation.workouts

data class WorkoutCard(
    val id: String,
    val title: String,
    val minutes: Int,
    val description: String
)

data class WorkoutsDiscover(
    val categories: List<String>,
    val cards: List<WorkoutCard>
)

