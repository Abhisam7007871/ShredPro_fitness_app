package com.aifitness.aimediaservice.repository;

import com.aifitness.aimediaservice.model.MediaRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface MediaRepository extends MongoRepository<MediaRequest, String> {
    Optional<MediaRequest> findByExerciseName(String exerciseName);
}
