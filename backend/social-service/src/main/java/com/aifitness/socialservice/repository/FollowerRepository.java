package com.aifitness.socialservice.repository;

import com.aifitness.socialservice.model.Follower;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FollowerRepository extends JpaRepository<Follower, UUID> {
    List<Follower> findByFollowerId(UUID followerId);
    List<Follower> findByFollowingId(UUID followingId);
    Optional<Follower> findByFollowerIdAndFollowingId(UUID followerId, UUID followingId);
    boolean existsByFollowerIdAndFollowingId(UUID followerId, UUID followingId);
    long countByFollowerId(UUID followerId);
    long countByFollowingId(UUID followingId);
}
