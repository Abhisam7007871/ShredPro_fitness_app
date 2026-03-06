package com.aifitness.workoutservice.controller;

import com.aifitness.workoutservice.model.WorkoutPlan;
import com.aifitness.workoutservice.model.WorkoutSession;
import com.aifitness.workoutservice.model.UserStats;
import com.aifitness.workoutservice.service.WorkoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/workouts")
@CrossOrigin(origins = "*")
public class WorkoutController {

    private final WorkoutService workoutService;

    @Autowired
    public WorkoutController(WorkoutService workoutService) {
        this.workoutService = workoutService;
    }

    @PostMapping("/generate")
    public ResponseEntity<WorkoutPlan> generatePlan(@RequestParam UUID userId, @RequestParam String goal, @RequestParam int days) {
        return ResponseEntity.ok(workoutService.generatePlan(userId, goal, days));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<WorkoutPlan>> getUserPlans(@PathVariable UUID userId) {
        return ResponseEntity.ok(workoutService.getUserPlans(userId));
    }

    @PostMapping("/session")
    public ResponseEntity<WorkoutSession> saveSession(@RequestBody WorkoutSession session) {
        return ResponseEntity.ok(workoutService.saveSession(session));
    }

    @GetMapping("/sessions/{userId}")
    public ResponseEntity<List<WorkoutSession>> getSessions(@PathVariable UUID userId) {
        return ResponseEntity.ok(workoutService.getUserSessions(userId));
    }

    @GetMapping("/stats/{userId}")
    public ResponseEntity<UserStats> getStats(@PathVariable UUID userId) {
        return ResponseEntity.ok(workoutService.getUserStats(userId));
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<UserStats>> getLeaderboard() {
        return ResponseEntity.ok(workoutService.getGlobalLeaderboard());
    }

    @GetMapping("/heatmap/{userId}")
    public ResponseEntity<List<Object[]>> getHeatmap(@PathVariable UUID userId) {
        return ResponseEntity.ok(workoutService.getActivityHeatmap(userId));
    }
}
