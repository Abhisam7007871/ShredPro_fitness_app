package com.aifitness.dietservice.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "food_items")
public class FoodItem {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String name;
    private int calories;
    private double protein;
    private double carbs;
    private double fat;
    
    private String servingSize;
    private boolean isVeg;
    private boolean isVegan;

    public FoodItem() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getCalories() { return calories; }
    public void setCalories(int calories) { this.calories = calories; }
    public double getProtein() { return protein; }
    public void setProtein(double protein) { this.protein = protein; }
    public double getCarbs() { return carbs; }
    public void setCarbs(double carbs) { this.carbs = carbs; }
    public double getFat() { return fat; }
    public void setFat(double fat) { this.fat = fat; }
    public String getServingSize() { return servingSize; }
    public void setServingSize(String servingSize) { this.servingSize = servingSize; }
    public boolean isVeg() { return isVeg; }
    public void setVeg(boolean isVeg) { this.isVeg = isVeg; }
    public boolean isVegan() { return isVegan; }
    public void setVegan(boolean isVegan) { this.isVegan = isVegan; }
}
