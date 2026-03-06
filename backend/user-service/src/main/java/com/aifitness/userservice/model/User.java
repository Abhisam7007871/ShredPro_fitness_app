package com.aifitness.userservice.model;

import jakarta.persistence.*;
import java.util.UUID;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String passwordHash;

    private String fullName;

    @Enumerated(EnumType.STRING)
    private AuthProvider provider;

    private String providerId;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    private Double currentWeight; // kg
    private Double height; // cm
    private Integer age;

    @Enumerated(EnumType.STRING)
    private ActivityLevel activityLevel; // SEDENTARY, MODERATE, ACTIVE

    private String goal; // WEIGHT_LOSS, MUSCLE_GAIN, RECOMP
    private String dietPreference; // VEG, NON_VEG, VEGAN
    private String country; // Region mapping for food DB

    @Column(columnDefinition = "TEXT")
    private String profilePicture;

    private String membershipLevel;
    private Boolean twoFactorEnabled;
    private Boolean notificationWorkout;
    private Boolean notificationDiet;
    private Boolean notificationAi;
    private Boolean notificationMarketing;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public User() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public AuthProvider getProvider() {
        return provider;
    }

    public void setProvider(AuthProvider provider) {
        this.provider = provider;
    }

    public String getProviderId() {
        return providerId;
    }

    public void setProviderId(String providerId) {
        this.providerId = providerId;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
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

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public ActivityLevel getActivityLevel() {
        return activityLevel;
    }

    public void setActivityLevel(ActivityLevel activityLevel) {
        this.activityLevel = activityLevel;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    public String getMembershipLevel() {
        return membershipLevel;
    }

    public void setMembershipLevel(String membershipLevel) {
        this.membershipLevel = membershipLevel;
    }

    public Boolean getTwoFactorEnabled() {
        return twoFactorEnabled;
    }

    public void setTwoFactorEnabled(Boolean twoFactorEnabled) {
        this.twoFactorEnabled = twoFactorEnabled;
    }

    public Boolean getNotificationWorkout() {
        return notificationWorkout;
    }

    public void setNotificationWorkout(Boolean notificationWorkout) {
        this.notificationWorkout = notificationWorkout;
    }

    public Boolean getNotificationDiet() {
        return notificationDiet;
    }

    public void setNotificationDiet(Boolean notificationDiet) {
        this.notificationDiet = notificationDiet;
    }

    public Boolean getNotificationAi() {
        return notificationAi;
    }

    public void setNotificationAi(Boolean notificationAi) {
        this.notificationAi = notificationAi;
    }

    public Boolean getNotificationMarketing() {
        return notificationMarketing;
    }

    public void setNotificationMarketing(Boolean notificationMarketing) {
        this.notificationMarketing = notificationMarketing;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        // Set defaults if not provided
        if (membershipLevel == null)
            membershipLevel = "Basic";
        if (twoFactorEnabled == null)
            twoFactorEnabled = false;
        if (notificationWorkout == null)
            notificationWorkout = true;
        if (notificationDiet == null)
            notificationDiet = false;
        if (notificationAi == null)
            notificationAi = true;
        if (notificationMarketing == null)
            notificationMarketing = false;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
