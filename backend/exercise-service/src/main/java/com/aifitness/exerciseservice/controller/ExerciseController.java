package com.aifitness.exerciseservice.controller;

import com.aifitness.exerciseservice.model.Exercise;
import com.aifitness.exerciseservice.service.ExerciseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/exercises")
@CrossOrigin(origins = "*")
public class ExerciseController {

    private final ExerciseService exerciseService;

    @Autowired
    public ExerciseController(ExerciseService exerciseService) {
        this.exerciseService = exerciseService;
    }

    @PostMapping
    public ResponseEntity<Exercise> createExercise(@RequestBody Exercise exercise) {
        return ResponseEntity.ok(exerciseService.createExercise(exercise));
    }

    @GetMapping
    public ResponseEntity<List<Exercise>> getAllExercises() {
        return ResponseEntity.ok(exerciseService.getAllExercises());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Exercise> getExerciseById(@PathVariable UUID id) {
        return ResponseEntity.ok(exerciseService.getExerciseById(id));
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Exercise>> getExercisesByCategory(@PathVariable String category) {
        return ResponseEntity.ok(exerciseService.getExercisesByCategory(category));
    }
}
