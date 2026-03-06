package com.aifitness.workoutservice.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "workout_sets")
public class WorkoutSet {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private UUID exerciseId;
    private int setNumber;
    private double weightKg;
    private int reps;
    private boolean completed;
    
    @ManyToOne
    @JoinColumn(name = "session_id")
    private WorkoutSession session;

    public WorkoutSet() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getExerciseId() { return exerciseId; }
    public void setExerciseId(UUID exerciseId) { this.exerciseId = exerciseId; }
    public int getSetNumber() { return setNumber; }
    public void setSetNumber(int setNumber) { this.setNumber = setNumber; }
    public double getWeightKg() { return weightKg; }
    public void setWeightKg(double weightKg) { this.weightKg = weightKg; }
    public int getReps() { return reps; }
    public void setReps(int reps) { this.reps = reps; }
    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
    public WorkoutSession getSession() { return session; }
    public void setSession(WorkoutSession session) { this.session = session; }
}
