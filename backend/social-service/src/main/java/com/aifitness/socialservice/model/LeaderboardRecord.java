package com.aifitness.socialservice.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "leaderboard")
public class LeaderboardRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String username;
    
    private double totalVolumeKG;
    private int workoutsCompleted;
    private int currentStreak;
    
    private String rankTier; // "ELITE", "PRO", "RECRUIT"
    
    private LocalDateTime lastUpdate;

    public LeaderboardRecord() {}

    public LeaderboardRecord(Long userId, String username) {
        this.userId = userId;
        this.username = username;
        this.totalVolumeKG = 0;
        this.workoutsCompleted = 0;
        this.currentStreak = 0;
        this.rankTier = "RECRUIT";
        this.lastUpdate = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public double getTotalVolumeKG() { return totalVolumeKG; }
    public void setTotalVolumeKG(double totalVolumeKG) { this.totalVolumeKG = totalVolumeKG; }
    public int getWorkoutsCompleted() { return workoutsCompleted; }
    public void setWorkoutsCompleted(int workoutsCompleted) { this.workoutsCompleted = workoutsCompleted; }
    public int getCurrentStreak() { return currentStreak; }
    public void setCurrentStreak(int currentStreak) { this.currentStreak = currentStreak; }
    public String getRankTier() { return rankTier; }
    public void setRankTier(String rankTier) { this.rankTier = rankTier; }
    public LocalDateTime getLastUpdate() { return lastUpdate; }
    public void setLastUpdate(LocalDateTime lastUpdate) { this.lastUpdate = lastUpdate; }
}
