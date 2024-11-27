package com.julytus.ChatService.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.julytus.ChatService.models.entity.Message;

@Repository
public interface MessageRepository extends MongoRepository<Message, String> {
    Page<Message> findByConversationId(String conversationId, Pageable pageable);
}