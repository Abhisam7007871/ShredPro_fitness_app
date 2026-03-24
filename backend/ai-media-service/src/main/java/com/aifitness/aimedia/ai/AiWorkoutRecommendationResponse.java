package com.aifitness.aimedia.ai;

import java.util.List;

public record AiWorkoutRecommendationResponse(
    Plan plan,
    ModelMetadata modelMetadata
) {

    public record Plan(
        String name,
        int durationWeeks,
        int daysPerWeek,
        List<Week> weeks
    ) {}

    public record Week(
        int weekNumber,
        List<Day> days
    ) {}

    public record Day(
        int dayNumber,
        String label,
        List<Exercise> exercises
    ) {}

    public record Exercise(
        String exerciseId,
        int sets,
        String reps,
        Integer rpe,
        String notes
    ) {}

    public record ModelMetadata(
        String modelName,
        String version,
        Double temperature
    ) {}
}

