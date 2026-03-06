package com.aifitness.dietservice.controller;

import com.aifitness.dietservice.model.DietPlan;
import com.aifitness.dietservice.service.DietService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/diet")
@CrossOrigin(origins = "*")
public class DietController {

    private final DietService dietService;

    @Autowired
    public DietController(DietService dietService) {
        this.dietService = dietService;
    }

    @PostMapping("/generate")
    public ResponseEntity<DietPlan> generateDietPlan(
            @RequestParam UUID userId,
            @RequestParam String goal) {
        
        return ResponseEntity.ok(dietService.generateDietPlan(userId, goal));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<DietPlan>> getUserDietPlans(@PathVariable UUID userId) {
        return ResponseEntity.ok(dietService.getUserDietPlans(userId));
    }

    @PostMapping("/log")
    public ResponseEntity<com.aifitness.dietservice.model.DailyMacroLog> logMacros(
            @RequestParam UUID userId,
            @RequestBody com.aifitness.dietservice.model.DailyMacroLog log) {
        return ResponseEntity.ok(dietService.logMacros(userId, log));
    }

    @GetMapping("/log")
    public ResponseEntity<com.aifitness.dietservice.model.DailyMacroLog> getDailyLog(
            @RequestParam UUID userId,
            @RequestParam(required = false) String date) {
        return ResponseEntity.ok(dietService.getDailyLog(userId, date));
    }
}
