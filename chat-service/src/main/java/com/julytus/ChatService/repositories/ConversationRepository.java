package com.julytus.ChatService.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.julytus.ChatService.models.entity.Conversation;

@Repository
public interface ConversationRepository extends MongoRepository<Conversation, String> {
    @Query("{ 'isGroup': false, 'userId': { $all: [?0, ?1] } }")
    Conversation findByTwoUsers(String user1Id, String user2Id);

    @Query("{ 'userId': { $in: ?0 } }")
    Page<Conversation> findByUserIdContaining(String[] userIds, Pageable pageable);
}