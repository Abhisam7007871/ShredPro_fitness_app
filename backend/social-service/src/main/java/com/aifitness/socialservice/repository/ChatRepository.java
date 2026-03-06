package com.aifitness.socialservice.repository;

import com.aifitness.socialservice.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ChatRepository extends JpaRepository<ChatMessage, UUID> {
    List<ChatMessage> findBySenderIdAndReceiverIdOrReceiverIdAndSenderIdOrderByTimestampAsc(
            UUID s1, UUID r1, UUID r2, UUID s2);
}
