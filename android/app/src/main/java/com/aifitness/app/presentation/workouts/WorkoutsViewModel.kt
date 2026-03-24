package com.aifitness.app.presentation.workouts

import com.aifitness.app.data.repository.mock.MockWorkoutsRepository

class WorkoutsViewModel(
    private val repository: MockWorkoutsRepository = MockWorkoutsRepository()
) {
    fun loadDiscover(): WorkoutsDiscover = repository.discover()
}

