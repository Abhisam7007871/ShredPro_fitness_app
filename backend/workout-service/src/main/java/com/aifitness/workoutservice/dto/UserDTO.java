package com.aifitness.workoutservice.dto;

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
    private String experienceLevel;
    private String membershipLevel;

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
    public String getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; }
    public String getMembershipLevel() { return membershipLevel; }
    public void setMembershipLevel(String membershipLevel) { this.membershipLevel = membershipLevel; }
}
