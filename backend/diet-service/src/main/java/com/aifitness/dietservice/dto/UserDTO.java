package com.aifitness.dietservice.dto;

import java.util.UUID;

public class UserDTO {
    private UUID id;
    private String email;
    private String fullName;
    private String gender;
    private Double currentWeight;
    private Double height;
    private Integer age;
    private String activityLevel;
    private String goal;
    private String dietPreference;
    private String country;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public Double getCurrentWeight() { return currentWeight; }
    public void setCurrentWeight(Double currentWeight) { this.currentWeight = currentWeight; }
    public Double getHeight() { return height; }
    public void setHeight(Double height) { this.height = height; }
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    public String getActivityLevel() { return activityLevel; }
    public void setActivityLevel(String activityLevel) { this.activityLevel = activityLevel; }
    public String getGoal() { return goal; }
    public void setGoal(String goal) { this.goal = goal; }
    public String getDietPreference() { return dietPreference; }
    public void setDietPreference(String dietPreference) { this.dietPreference = dietPreference; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
}
