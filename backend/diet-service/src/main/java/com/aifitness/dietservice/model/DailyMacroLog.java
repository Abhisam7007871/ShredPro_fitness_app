package com.aifitness.dietservice.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "daily_macro_logs")
public class DailyMacroLog {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private UUID userId;
    private LocalDate date;

    private int calories;
    private double protein;
    private double carbs;
    private double fat;
    private double fiber;

    public DailyMacroLog() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public int getCalories() { return calories; }
    public void setCalories(int calories) { this.calories = calories; }
    public double getProtein() { return protein; }
    public void setProtein(double protein) { this.protein = protein; }
    public double getCarbs() { return carbs; }
    public void setCarbs(double carbs) { this.carbs = carbs; }
    public double getFat() { return fat; }
    public void setFat(double fat) { this.fat = fat; }
    public double getFiber() { return fiber; }
    public void setFiber(double fiber) { this.fiber = fiber; }
}
