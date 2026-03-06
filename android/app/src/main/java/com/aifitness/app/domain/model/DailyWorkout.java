package com.aifitness.app.domain.model;

import java.util.List;

public class DailyWorkout {
    private String id;
    private String dayName;
    private String focusArea;
    private List<ScheduledExercise> exercises;

    public String getDayName() {
        return dayName;
    }

    public String getFocusArea() {
        return focusArea;
    }

    public List<ScheduledExercise> getExercises() {
        return exercises;
    }
}
