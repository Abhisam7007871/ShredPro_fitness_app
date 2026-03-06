package com.aifitness.userservice.dto;

import com.aifitness.userservice.model.Gender;

public class BiometricsUpdateDto {
    private Integer age;
    private Gender gender;
    private Double currentWeight;
    private Double height;
    private String goal;
    private String dietPreference;
    private String country;

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public Double getCurrentWeight() {
        return currentWeight;
    }

    public void setCurrentWeight(Double currentWeight) {
        this.currentWeight = currentWeight;
    }

    public Double getHeight() {
        return height;
    }

    public void setHeight(Double height) {
        this.height = height;
    }

    public String getGoal() {
        return goal;
    }

    public void setGoal(String goal) {
        this.goal = goal;
    }

    public String getDietPreference() {
        return dietPreference;
    }

    public void setDietPreference(String dietPreference) {
        this.dietPreference = dietPreference;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }
}
