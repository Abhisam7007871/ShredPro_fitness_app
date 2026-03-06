package com.aifitness.dietservice.model;

import jakarta.persistence.*;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "meals")
public class Meal {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String name;
    private int totalCalories;
    
    @ManyToMany
    private List<FoodItem> items;

    public Meal() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getTotalCalories() { return totalCalories; }
    public void setTotalCalories(int totalCalories) { this.totalCalories = totalCalories; }
    public List<FoodItem> getItems() { return items; }
    public void setItems(List<FoodItem> items) { this.items = items; }
}
