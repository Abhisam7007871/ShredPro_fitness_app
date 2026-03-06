package com.aifitness.workoutservice.model;

import jakarta.persistence.*;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "daily_workouts")
public class DailyWorkout { // Added 'public class DailyWorkout {'

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String dayName;
    private String focusArea;
    private Boolean isRecovery = false;

    @OneToMany(cascade = CascadeType.ALL)
    private List<ScheduledExercise> exercises;

    public DailyWorkout() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getDayName() { return dayName; }
    public void setDayName(String dayName) { this.dayName = dayName; }
    public String getFocusArea() { return focusArea; }
    public void setFocusArea(String focusArea) { this.focusArea = focusArea; }
    public List<ScheduledExercise> getExercises() { return exercises; }
    public void setExercises(List<ScheduledExercise> exercises) { this.exercises = exercises; }
    public Boolean getIsRecovery() { return isRecovery; }
    public void setIsRecovery(Boolean isRecovery) { this.isRecovery = isRecovery; }
}
