package com.aifitness.workoutservice.controller;

import com.aifitness.workoutservice.model.WorkoutRoutine;
import com.aifitness.workoutservice.repository.WorkoutRoutineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/workouts/routines")
@CrossOrigin(origins = "*")
public class WorkoutRoutineController {

    @Autowired
    private WorkoutRoutineRepository routineRepository;

    @PostMapping
    public ResponseEntity<WorkoutRoutine> createRoutine(@RequestBody WorkoutRoutine routine) {
        return ResponseEntity.ok(routineRepository.save(routine));
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<WorkoutRoutine> getRoutineById(@PathVariable("id") UUID id) {
        return routineRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<WorkoutRoutine>> getRoutines(@PathVariable UUID userId) {
        return ResponseEntity.ok(routineRepository.findByUserIdOrderByCreatedAtDesc(userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoutine(@PathVariable UUID id) {
        routineRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
