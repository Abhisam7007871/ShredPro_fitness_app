package com.aifitness.dietservice.repository;

import com.aifitness.dietservice.model.DietPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface DietPlanRepository extends JpaRepository<DietPlan, UUID> {
    List<DietPlan> findByUserId(UUID userId);
}
