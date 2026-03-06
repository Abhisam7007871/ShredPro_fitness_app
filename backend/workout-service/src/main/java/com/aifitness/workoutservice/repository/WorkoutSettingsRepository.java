package com.aifitness.workoutservice.repository;

import com.aifitness.workoutservice.model.WorkoutSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface WorkoutSettingsRepository extends JpaRepository<WorkoutSettings, Long> {
    Optional<WorkoutSettings> findByUserId(Long userId);
}
