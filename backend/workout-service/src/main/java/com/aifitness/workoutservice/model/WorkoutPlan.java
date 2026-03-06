package com.aifitness.workoutservice.model;

import jakarta.persistence.*;
import java.util.List;
import java.util.UUID;
import java.time.LocalDateTime;

@Entity
@Table(name = "workout_plans")
public class WorkoutPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private UUID userId;
    private String name;
    private String goalType;
    private int durationWeeks;
    private Boolean isAdaptive = false;
    
    @OneToMany(cascade = CascadeType.ALL)
    private List<DailyWorkout> dailyWorkouts;

    private LocalDateTime createdAt;

    public WorkoutPlan() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getGoalType() { return goalType; }
    public void setGoalType(String goalType) { this.goalType = goalType; }
    public int getDurationWeeks() { return durationWeeks; }
    public void setDurationWeeks(int durationWeeks) { this.durationWeeks = durationWeeks; }
    public List<DailyWorkout> getDailyWorkouts() { return dailyWorkouts; }
    public void setDailyWorkouts(List<DailyWorkout> dailyWorkouts) { this.dailyWorkouts = dailyWorkouts; }
    public Boolean getIsAdaptive() { return isAdaptive; }
    public void setIsAdaptive(Boolean isAdaptive) { this.isAdaptive = isAdaptive; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
