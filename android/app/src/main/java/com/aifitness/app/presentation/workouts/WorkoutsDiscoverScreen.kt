package com.aifitness.app.presentation.workouts

class WorkoutsDiscoverScreen(
    private val viewModel: WorkoutsViewModel = WorkoutsViewModel()
) {
    fun render(): WorkoutsDiscover = viewModel.loadDiscover()
}

