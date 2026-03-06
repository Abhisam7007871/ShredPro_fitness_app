package com.aifitness.workoutservice.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "workout_settings")
public class WorkoutSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private boolean rpeEnabled = true;
    private boolean plateCalculatorEnabled = true;
    private boolean inlineTimerEnabled = true;
    private boolean keepAwakeEnabled = false;

    private String preferredWeightUnit = "KG"; // "KG" or "LBS"

    private LocalDateTime updatedAt;

    public WorkoutSettings() {}

    public WorkoutSettings(Long userId) {
        this.userId = userId;
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public boolean isRpeEnabled() { return rpeEnabled; }
    public void setRpeEnabled(boolean rpeEnabled) { this.rpeEnabled = rpeEnabled; }
    public boolean isPlateCalculatorEnabled() { return plateCalculatorEnabled; }
    public void setPlateCalculatorEnabled(boolean plateCalculatorEnabled) { this.plateCalculatorEnabled = plateCalculatorEnabled; }
    public boolean isInlineTimerEnabled() { return inlineTimerEnabled; }
    public void setInlineTimerEnabled(boolean inlineTimerEnabled) { this.inlineTimerEnabled = inlineTimerEnabled; }
    public boolean isKeepAwakeEnabled() { return keepAwakeEnabled; }
    public void setKeepAwakeEnabled(boolean keepAwakeEnabled) { this.keepAwakeEnabled = keepAwakeEnabled; }
    public String getPreferredWeightUnit() { return preferredWeightUnit; }
    public void setPreferredWeightUnit(String preferredWeightUnit) { this.preferredWeightUnit = preferredWeightUnit; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

