package com.aifitness.exerciseservice.repository;

import com.aifitness.exerciseservice.model.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, UUID> {
    List<Exercise> findByCategoryIgnoreCase(String category);
    List<Exercise> findByTargetMuscleGroupsContaining(String muscle);
}
