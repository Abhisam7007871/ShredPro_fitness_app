package com.aifitness.socialservice.controller;

import com.aifitness.socialservice.model.LeaderboardRecord;
import com.aifitness.socialservice.repository.LeaderboardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/social/leaderboard")
@CrossOrigin(origins = "*")
public class LeaderboardController {

    private final LeaderboardRepository leaderboardRepository;

    @Autowired
    public LeaderboardController(LeaderboardRepository leaderboardRepository) {
        this.leaderboardRepository = leaderboardRepository;
    }

    @GetMapping
    public ResponseEntity<List<LeaderboardRecord>> getLeaderboard() {
        return ResponseEntity.ok(leaderboardRepository.findAllByOrderByTotalVolumeKGDesc());
    }

    @PostMapping("/update")
    public ResponseEntity<LeaderboardRecord> updateStats(
            @RequestParam Long userId, 
            @RequestParam String username,
            @RequestParam double additionalVolume,
            @RequestParam int additionalWorkouts,
            @RequestParam int currentStreak) {
        
        LeaderboardRecord record = leaderboardRepository.findByUserId(userId)
                .orElse(new LeaderboardRecord(userId, username));
        
        record.setTotalVolumeKG(record.getTotalVolumeKG() + additionalVolume);
        record.setWorkoutsCompleted(record.getWorkoutsCompleted() + additionalWorkouts);
        record.setCurrentStreak(currentStreak);
        record.setLastUpdate(LocalDateTime.now());
        
        // Dynamic Tier Logic
        if (record.getTotalVolumeKG() > 100000) {
            record.setRankTier("ELITE");
        } else if (record.getTotalVolumeKG() > 25000) {
            record.setRankTier("PRO");
        } else {
            record.setRankTier("RECRUIT");
        }
        
        return ResponseEntity.ok(leaderboardRepository.save(record));
    }
}
