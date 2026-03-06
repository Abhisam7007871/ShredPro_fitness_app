package com.aifitness.workoutservice.model;

import jakarta.persistence.*;
import java.util.UUID;
import java.time.LocalDate;

@Entity
@Table(name = "user_stats")
public class UserStats {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(unique = true, nullable = false)
    private UUID userId;

    private int currentStreak;
    private int longestStreak;
    private int totalWorkouts;
    private double totalWeightKg;
    private long totalReps;
    private long totalCalories;
    private long totalDurationSeconds;
    
    private LocalDate lastWorkoutDate;
    
    private int xp;
    private int globalRank;

    public UserStats() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public int getCurrentStreak() { return currentStreak; }
    public void setCurrentStreak(int currentStreak) { this.currentStreak = currentStreak; }

    public int getLongestStreak() { return longestStreak; }
    public void setLongestStreak(int longestStreak) { this.longestStreak = longestStreak; }

    public int getTotalWorkouts() { return totalWorkouts; }
    public void setTotalWorkouts(int totalWorkouts) { this.totalWorkouts = totalWorkouts; }

    public double getTotalWeightKg() { return totalWeightKg; }
    public void setTotalWeightKg(double totalWeightKg) { this.totalWeightKg = totalWeightKg; }

    public long getTotalReps() { return totalReps; }
    public void setTotalReps(long totalReps) { this.totalReps = totalReps; }

    public long getTotalCalories() { return totalCalories; }
    public void setTotalCalories(long totalCalories) { this.totalCalories = totalCalories; }

    public long getTotalDurationSeconds() { return totalDurationSeconds; }
    public void setTotalDurationSeconds(long totalDurationSeconds) { this.totalDurationSeconds = totalDurationSeconds; }

    public LocalDate getLastWorkoutDate() { return lastWorkoutDate; }
    public void setLastWorkoutDate(LocalDate lastWorkoutDate) { this.lastWorkoutDate = lastWorkoutDate; }

    public int getXp() { return xp; }
    public void setXp(int xp) { this.xp = xp; }

    public int getGlobalRank() { return globalRank; }
    public void setGlobalRank(int globalRank) { this.globalRank = globalRank; }
}
