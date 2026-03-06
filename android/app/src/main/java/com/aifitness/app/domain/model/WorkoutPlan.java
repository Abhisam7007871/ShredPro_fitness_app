package com.aifitness.app.domain.model;

import java.util.List;

public class WorkoutPlan {
    private String id;
    private String name;
    private String goalType;
    private int durationWeeks;
    private List<DailyWorkout> dailyWorkouts;

    // Getters
    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getGoalType() {
        return goalType;
    }

    public int getDurationWeeks() {
        return durationWeeks;
    }

    public List<DailyWorkout> getDailyWorkouts() {
        return dailyWorkouts;
    }
}
