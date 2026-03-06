package com.aifitness.socialservice.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "followers")
public class Follower {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private UUID followerId;

    @Column(nullable = false)
    private UUID followingId;

    private LocalDateTime createdAt;

    public Follower() {}

    public Follower(UUID followerId, UUID followingId) {
        this.followerId = followerId;
        this.followingId = followingId;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getFollowerId() { return followerId; }
    public void setFollowerId(UUID followerId) { this.followerId = followerId; }
    public UUID getFollowingId() { return followingId; }
    public void setFollowingId(UUID followingId) { this.followingId = followingId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
