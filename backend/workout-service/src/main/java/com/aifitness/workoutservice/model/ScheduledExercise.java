package com.aifitness.workoutservice.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "scheduled_exercises")
public class ScheduledExercise {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private UUID exerciseId; 
    private String exerciseName;
    
    private Integer sets = 0;
    private String reps; 
    private Integer duration = 0; // In seconds
    private String type; // TIME or REPS
    private Integer restSeconds = 0;
    private Double recommendedWeight = 0.0;
    private String notes;

    public ScheduledExercise() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getExerciseId() { return exerciseId; }
    public void setExerciseId(UUID exerciseId) { this.exerciseId = exerciseId; }
    public String getExerciseName() { return exerciseName; }
    public void setExerciseName(String exerciseName) { this.exerciseName = exerciseName; }
    public Integer getSets() { return sets; }
    public void setSets(Integer sets) { this.sets = sets; }
    public String getReps() { return reps; }
    public void setReps(String reps) { this.reps = reps; }
    public Integer getRestSeconds() { return restSeconds; }
    public void setRestSeconds(Integer restSeconds) { this.restSeconds = restSeconds; }
    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public Double getRecommendedWeight() { return recommendedWeight; }
    public void setRecommendedWeight(Double recommendedWeight) { this.recommendedWeight = recommendedWeight; }
}
