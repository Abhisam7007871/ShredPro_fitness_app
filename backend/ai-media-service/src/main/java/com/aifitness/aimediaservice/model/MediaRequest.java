package com.aifitness.aimediaservice.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "media_requests")
public class MediaRequest {

    @Id
    private String id;

    private String exerciseName;
    private String prompt; 
    private String status; 
    
    private String videoUrl; 
    private String gifUrl;
    private String imageUrl;
    private String highlightUrl;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public MediaRequest() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getExerciseName() { return exerciseName; }
    public void setExerciseName(String exerciseName) { this.exerciseName = exerciseName; }
    public String getPrompt() { return prompt; }
    public void setPrompt(String prompt) { this.prompt = prompt; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }
    public String getGifUrl() { return gifUrl; }
    public void setGifUrl(String gifUrl) { this.gifUrl = gifUrl; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getHighlightUrl() { return highlightUrl; }
    public void setHighlightUrl(String highlightUrl) { this.highlightUrl = highlightUrl; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
