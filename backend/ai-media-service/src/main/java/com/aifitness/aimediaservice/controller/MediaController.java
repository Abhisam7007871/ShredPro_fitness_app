package com.aifitness.aimediaservice.controller;

import com.aifitness.aimediaservice.model.MediaRequest;
import com.aifitness.aimediaservice.service.AiMediaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/media")
@CrossOrigin(origins = "*")
public class MediaController {

    private final AiMediaService aiMediaService;

    @Autowired
    public MediaController(AiMediaService aiMediaService) {
        this.aiMediaService = aiMediaService;
    }

    @PostMapping("/generate")
    public ResponseEntity<MediaRequest> generateMedia(@RequestParam String exerciseName, @RequestParam String prompt) {
        return ResponseEntity.ok(aiMediaService.getOrGenerateMedia(exerciseName, prompt));
    }
}
