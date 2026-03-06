package com.aifitness.exerciseservice.model;

import jakarta.persistence.*;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "exercises")
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category;

    private String difficultyLevel; // Beginner, Intermediate, Advanced

    private int defaultDuration; // In seconds

    private String exerciseType; // TIME or REPS

    @Column(columnDefinition = "TEXT")
    private String definition;

    private String homeEquipment;
    private String gymEquipment;
    private String equipmentCategory; // Barbell, Dumbbell, etc.

    @ElementCollection
    private List<String> targetMuscleGroups;

    private String videoUrl;
    private String previewImageUrl;
    private String muscleHighlightUrl;

    @Column(columnDefinition = "TEXT")
    private String metadata;

    public Exercise() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getDifficultyLevel() { return difficultyLevel; }
    public void setDifficultyLevel(String difficultyLevel) { this.difficultyLevel = difficultyLevel; }
    public List<String> getTargetMuscleGroups() { return targetMuscleGroups; }
    public void setTargetMuscleGroups(List<String> targetMuscleGroups) { this.targetMuscleGroups = targetMuscleGroups; }
    public String getDefinition() { return definition; }
    public void setDefinition(String definition) { this.definition = definition; }
    public String getHomeEquipment() { return homeEquipment; }
    public void setHomeEquipment(String homeEquipment) { this.homeEquipment = homeEquipment; }
    public String getGymEquipment() { return gymEquipment; }
    public void setGymEquipment(String gymEquipment) { this.gymEquipment = gymEquipment; }
    public String getEquipmentCategory() { return equipmentCategory; }
    public void setEquipmentCategory(String equipmentCategory) { this.equipmentCategory = equipmentCategory; }
    public String getPreviewImageUrl() { return previewImageUrl; }
    public void setPreviewImageUrl(String previewImageUrl) { this.previewImageUrl = previewImageUrl; }
    public String getMuscleHighlightUrl() { return muscleHighlightUrl; }
    public void setMuscleHighlightUrl(String muscleHighlightUrl) { this.muscleHighlightUrl = muscleHighlightUrl; }
    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }
    public int getDefaultDuration() { return defaultDuration; }
    public void setDefaultDuration(int defaultDuration) { this.defaultDuration = defaultDuration; }
    public String getExerciseType() { return exerciseType; }
    public void setExerciseType(String exerciseType) { this.exerciseType = exerciseType; }
    public String getMetadata() { return metadata; }
    public void setMetadata(String metadata) { this.metadata = metadata; }
}
