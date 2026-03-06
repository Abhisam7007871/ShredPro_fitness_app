package com.aifitness.dietservice.repository;

import com.aifitness.dietservice.model.DailyMacroLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

public interface DailyMacroLogRepository extends JpaRepository<DailyMacroLog, UUID> {
    Optional<DailyMacroLog> findByUserIdAndDate(UUID userId, LocalDate date);
}
