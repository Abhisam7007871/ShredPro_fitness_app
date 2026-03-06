package com.aifitness.workoutservice.repository;

import com.aifitness.workoutservice.model.UserStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;
import java.util.UUID;
import java.util.List;

public interface UserStatsRepository extends JpaRepository<UserStats, UUID> {
    Optional<UserStats> findByUserId(UUID userId);
    
    @Query("SELECT u FROM UserStats u ORDER BY u.xp DESC")
    List<UserStats> findAllOrderByXpDesc();
}
