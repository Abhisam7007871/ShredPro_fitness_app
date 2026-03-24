package com.aifitness.aimedia.ai;

import java.util.List;
import java.util.Map;

public record AiWorkoutPromptContext(
    String userId,
    Profile profile,
    Goals goals,
    Preferences preferences,
    Constraints constraints,
    HistorySummary historySummary
) {

    public record Profile(
        Integer age,
        String sex,
        Integer heightCm,
        Integer weightKg,
        Integer trainingAgeYears,
        String experienceLevel
    ) {}

    public record Goals(
        String primary,
        List<String> secondary
    ) {}

    public record Preferences(
        Integer daysPerWeek,
        Integer sessionLengthMinutes,
        List<String> availableEquipment,
        String preferredSplit
    ) {}

    public record Constraints(
        List<String> injuriesOrConstraints
    ) {}

    public record HistorySummary(
        Integer recentWorkoutsPerWeek,
        Integer avgRpe,
        Map<String, Integer> known1Rm
    ) {}
}

