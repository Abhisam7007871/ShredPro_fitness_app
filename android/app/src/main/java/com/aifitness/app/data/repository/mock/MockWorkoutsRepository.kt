package com.aifitness.app.data.repository.mock

import com.aifitness.app.presentation.workouts.WorkoutCard
import com.aifitness.app.presentation.workouts.WorkoutsDiscover

class MockWorkoutsRepository {
    fun discover(): WorkoutsDiscover {
        return WorkoutsDiscover(
            categories = listOf("All", "Strength", "Focus", "Full body"),
            cards = listOf(
                WorkoutCard("upper-30", "Upper body workout", 30, "Glutes / Squads / Hamstrings"),
                WorkoutCard("lower-30", "Lower body workout", 30, "Glutes / Squads / Hamstrings")
            )
        )
    }
}

