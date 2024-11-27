package com.julytus.ChatService.models.entity;

import java.time.LocalDateTime;
import java.util.Set;

import lombok.Builder;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.MongoId;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "conversations")
@Builder
@Getter
@Setter
public class Conversation {
    @MongoId
    private String id;
    
    private Message lastMessage;
    
    private boolean isGroup;
    
    private String name;
    
    private Set<String> userId;

    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
