package com.aifitness.socialservice.repository;

import com.aifitness.socialservice.model.LeaderboardRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface LeaderboardRepository extends JpaRepository<LeaderboardRecord, Long> {
    Optional<LeaderboardRecord> findByUserId(Long userId);
    List<LeaderboardRecord> findAllByOrderByTotalVolumeKGDesc();
}
