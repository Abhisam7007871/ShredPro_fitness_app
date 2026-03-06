package com.aifitness.exerciseservice.service;

import com.aifitness.exerciseservice.model.Exercise;
import com.aifitness.exerciseservice.repository.ExerciseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class ExerciseService {

    private final ExerciseRepository exerciseRepository;

    @Autowired
    public ExerciseService(ExerciseRepository exerciseRepository) {
        this.exerciseRepository = exerciseRepository;
    }

    public Exercise createExercise(Exercise exercise) {
        return exerciseRepository.save(exercise);
    }

    public List<Exercise> getAllExercises() {
        return exerciseRepository.findAll();
    }

    public Exercise getExerciseById(UUID id) {
        return exerciseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exercise not found"));
    }

    public List<Exercise> getExercisesByCategory(String category) {
        return exerciseRepository.findByCategoryIgnoreCase(category);
    }
}
