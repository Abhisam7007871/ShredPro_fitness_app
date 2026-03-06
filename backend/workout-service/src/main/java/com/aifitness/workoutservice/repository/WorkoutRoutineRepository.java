package com.aifitness.workoutservice.repository;

import com.aifitness.workoutservice.model.WorkoutRoutine;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface WorkoutRoutineRepository extends JpaRepository<WorkoutRoutine, UUID> {
    List<WorkoutRoutine> findByUserIdOrderByCreatedAtDesc(UUID userId);
}
