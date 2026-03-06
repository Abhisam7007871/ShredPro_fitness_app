package com.aifitness.workoutservice.controller;

import com.aifitness.workoutservice.model.WorkoutSettings;
import com.aifitness.workoutservice.repository.WorkoutSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/workouts/settings")
@CrossOrigin(origins = "*")
public class WorkoutSettingsController {

    private final WorkoutSettingsRepository settingsRepository;

    @Autowired
    public WorkoutSettingsController(WorkoutSettingsRepository settingsRepository) {
        this.settingsRepository = settingsRepository;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<WorkoutSettings> getSettings(@PathVariable Long userId) {
        WorkoutSettings settings = settingsRepository.findByUserId(userId)
                .orElseGet(() -> settingsRepository.save(new WorkoutSettings(userId)));
        return ResponseEntity.ok(settings);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<WorkoutSettings> updateSettings(@PathVariable Long userId, @RequestBody WorkoutSettings updatedSettings) {
        WorkoutSettings settings = settingsRepository.findByUserId(userId)
                .orElse(new WorkoutSettings(userId));
        
        settings.setRpeEnabled(updatedSettings.isRpeEnabled());
        settings.setPlateCalculatorEnabled(updatedSettings.isPlateCalculatorEnabled());
        settings.setInlineTimerEnabled(updatedSettings.isInlineTimerEnabled());
        settings.setKeepAwakeEnabled(updatedSettings.isKeepAwakeEnabled());
        settings.setPreferredWeightUnit(updatedSettings.getPreferredWeightUnit());
        settings.setUpdatedAt(LocalDateTime.now());
        
        return ResponseEntity.ok(settingsRepository.save(settings));
    }
}
