package com.aifitness.app.domain.model;

public class ScheduledExercise {
    private String id;
    private String exerciseName;
    private int sets;
    private String reps;
    private int restSeconds;

    public ScheduledExercise() {
    }

    public ScheduledExercise(String exerciseName, int sets, String reps) {
        this.exerciseName = exerciseName;
        this.sets = sets;
        this.reps = reps;
    }

    public String getExerciseName() {
        return exerciseName;
    }

    public void setExerciseName(String exerciseName) {
        this.exerciseName = exerciseName;
    }

    public int getSets() {
        return sets;
    }

    public void setSets(int sets) {
        this.sets = sets;
    }

    public String getReps() {
        return reps;
    }

    public void setReps(String reps) {
        this.reps = reps;
    }

    public int getRestSeconds() {
        return restSeconds;
    }

    public void setRestSeconds(int restSeconds) {
        this.restSeconds = restSeconds;
    }
}
