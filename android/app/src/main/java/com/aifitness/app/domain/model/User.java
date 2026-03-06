package com.aifitness.app.domain.model;

public class User {
    private String id;
    private String email;
    private String fullName;
    private double weight;
    private double height;
    private int age;
    private String gender;
    private String activityLevel;

    public User(String id, String email, String fullName) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getFullName() {
        return fullName;
    }
}
