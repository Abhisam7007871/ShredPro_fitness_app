package com.aifitness.workoutservice.repository;

import com.aifitness.workoutservice.model.WorkoutSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.UUID;
import java.time.LocalDate;

public interface WorkoutSessionRepository extends JpaRepository<WorkoutSession, UUID> {
    List<WorkoutSession> findByUserId(UUID userId);
    
    @Query("SELECT CAST(w.startTime AS LocalDate) as date, COUNT(w) as count " +
           "FROM WorkoutSession w WHERE w.userId = :userId " +
           "GROUP BY CAST(w.startTime AS LocalDate)")
    List<Object[]> getActivityHeatmap(@Param("userId") UUID userId);
}
