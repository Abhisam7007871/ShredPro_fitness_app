package com.aifitness.dietservice.model;

import jakarta.persistence.*;
import java.util.List;
import java.util.UUID;
import java.time.LocalDateTime;

@Entity
@Table(name = "diet_plans")
public class DietPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private UUID userId;
    private String goal;
    private int dailyCalorieTarget;
    
    @OneToMany(cascade = CascadeType.ALL)
    private List<Meal> dailyMeals;

    @Column(columnDefinition = "TEXT")
    private String aiAdvice;

    private LocalDateTime createdAt;
    
    public DietPlan() {}

    public String getAiAdvice() { return aiAdvice; }
    public void setAiAdvice(String aiAdvice) { this.aiAdvice = aiAdvice; }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public String getGoal() { return goal; }
    public void setGoal(String goal) { this.goal = goal; }
    public int getDailyCalorieTarget() { return dailyCalorieTarget; }
    public void setDailyCalorieTarget(int dailyCalorieTarget) { this.dailyCalorieTarget = dailyCalorieTarget; }
    public List<Meal> getDailyMeals() { return dailyMeals; }
    public void setDailyMeals(List<Meal> dailyMeals) { this.dailyMeals = dailyMeals; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
