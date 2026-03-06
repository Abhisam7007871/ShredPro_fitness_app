package com.aifitness.socialservice.repository;

import com.aifitness.socialservice.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface PostRepository extends JpaRepository<Post, UUID> {
    List<Post> findAllByOrderByCreatedAtDesc();
}
