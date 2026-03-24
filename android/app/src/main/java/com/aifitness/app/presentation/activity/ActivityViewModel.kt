package com.aifitness.app.presentation.activity

import com.aifitness.app.data.repository.mock.MockActivityRepository

class ActivityViewModel(
    private val repository: MockActivityRepository = MockActivityRepository()
) {
    fun loadSummary(): ActivitySummary = repository.getSummary()
}

