package com.aifitness.workoutservice.repository;

import com.aifitness.workoutservice.model.WorkoutPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface WorkoutPlanRepository extends JpaRepository<WorkoutPlan, UUID> {
    List<WorkoutPlan> findByUserId(UUID userId);
}
