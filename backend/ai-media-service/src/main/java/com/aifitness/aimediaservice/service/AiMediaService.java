package com.aifitness.aimediaservice.service;

import com.aifitness.aimediaservice.model.MediaRequest;
import com.aifitness.aimediaservice.repository.MediaRepository;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Service
public class AiMediaService {

    private final MediaRepository mediaRepository;

    @Autowired
    public AiMediaService(MediaRepository mediaRepository) {
        this.mediaRepository = mediaRepository;
    }

    public MediaRequest getOrGenerateMedia(String exerciseName, String prompt) {
        Optional<MediaRequest> existing = mediaRepository.findByExerciseName(exerciseName);
        if (existing.isPresent() && "COMPLETED".equals(existing.get().getStatus())) {
            return existing.get();
        }

        MediaRequest request = existing.orElse(new MediaRequest());
        request.setExerciseName(exerciseName);
        request.setPrompt(prompt);
        request.setStatus("GENERATING");
        request.setCreatedAt(LocalDateTime.now());
        request.setUpdatedAt(LocalDateTime.now());
        
        MediaRequest savedRequest = mediaRepository.save(request);

        // Run AI generation asynchronously
        CompletableFuture.runAsync(() -> {
            try {
                String videoUrl = callSora2Api(prompt);
                savedRequest.setVideoUrl(videoUrl);
                savedRequest.setStatus("COMPLETED");
                savedRequest.setUpdatedAt(LocalDateTime.now());
                mediaRepository.save(savedRequest);
            } catch (Exception e) {
                savedRequest.setStatus("FAILED");
                savedRequest.setUpdatedAt(LocalDateTime.now());
                mediaRepository.save(savedRequest);
            }
        });

        return savedRequest;
    }

    private String callSora2Api(String prompt) throws Exception {
        String apiKey = System.getenv("EMERGENT_LLM_KEY");
        if (apiKey == null) apiKey = "sk-emergent-7Be775251E2B6774c7"; // Fallback as requested

        OkHttpClient client = new OkHttpClient();
        
        // This is a placeholder for the actual Sora 2 API endpoint and payload
        // Following the logic from the user-provided FastAPI example
        String jsonPayload = String.format(
            "{\"prompt\": \"%s\", \"model\": \"sora-2\", \"size\": \"1280x720\", \"duration\": 8}",
            prompt.replace("\"", "\\\"")
        );

        RequestBody body = RequestBody.create(
            jsonPayload,
            MediaType.get("application/json; charset=utf-8")
        );

        Request request = new Request.Builder()
            .url("https://api.emergent.ai/v1/video/generate")
            .addHeader("Authorization", "Bearer " + apiKey)
            .post(body)
            .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) throw new Exception("Unexpected code " + response);
            
            // In a real implementation, parse the JSON response to get the video URL
            // For now, we simulate returning a generated path/URL
            return "https://cdn.aifitness.com/videos/" + UUID.randomUUID().toString() + ".mp4";
        }
    }
}
