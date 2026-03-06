package com.aifitness.workoutservice.model;

import jakarta.persistence.*;
import java.util.UUID;
import java.time.LocalDateTime;

@Entity
@Table(name = "workout_sessions")
public class WorkoutSession {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private UUID userId;
    private String workoutName;
    private String category;
    
    private int totalExercises;
    private int completedExercises;
    private int totalDurationSeconds; // Actual time spent
    private int caloriesBurned;
    private Double totalWeightKg = 0.0;
    private Integer totalReps = 0;
    
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<WorkoutSet> sets = new java.util.ArrayList<>();

    public WorkoutSession() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public String getWorkoutName() { return workoutName; }
    public void setWorkoutName(String workoutName) { this.workoutName = workoutName; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public int getTotalExercises() { return totalExercises; }
    public void setTotalExercises(int totalExercises) { this.totalExercises = totalExercises; }
    public int getCompletedExercises() { return completedExercises; }
    public void setCompletedExercises(int completedExercises) { this.completedExercises = completedExercises; }
    public int getTotalDurationSeconds() { return totalDurationSeconds; }
    public void setTotalDurationSeconds(int totalDurationSeconds) { this.totalDurationSeconds = totalDurationSeconds; }
    public int getCaloriesBurned() { return caloriesBurned; }
    public void setCaloriesBurned(int caloriesBurned) { this.caloriesBurned = caloriesBurned; }
    public Double getTotalWeightKg() { return totalWeightKg; }
    public void setTotalWeightKg(Double totalWeightKg) { this.totalWeightKg = totalWeightKg; }
    public Integer getTotalReps() { return totalReps; }
    public void setTotalReps(Integer totalReps) { this.totalReps = totalReps; }
    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

    public java.util.List<WorkoutSet> getSets() { return sets; }
    public void setSets(java.util.List<WorkoutSet> sets) { this.sets = sets; }

    @PrePersist
    protected void onCreate() {
        startTime = LocalDateTime.now();
    }
}
