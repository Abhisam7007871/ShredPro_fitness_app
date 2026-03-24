package com.aifitness.app.presentation.activity

/**
 * UI implementation depends on your Android UI stack (Compose vs XML).
 * This file defines the screen contract so the rest of the app can be wired.
 */
class ActivityScreen(
    private val viewModel: ActivityViewModel = ActivityViewModel()
) {
    fun render(): ActivitySummary {
        return viewModel.loadSummary()
    }
}

