package com.julytus.search.DebeziumListener;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.julytus.search.models.PostDocument;
import com.julytus.search.repositories.PostSearchRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
public class PostSync {
    private final ObjectMapper objectMapper;
    private final PostSearchRepository postSearchRepository;

    @KafkaListener(topics = "mongodb-vibly.post_service.post", groupId = "search-services-group")
    public void handlePostChange(String payload) {
        log.info("Received message: {}", payload);
        try {
            JsonNode jsonNode = objectMapper.readTree(payload);
            
            if (jsonNode.has("op")) {
                handleDebeziumMessage(jsonNode);
            } else {
                handleMongoMessage(jsonNode);
            }
        } catch (Exception e) {
            log.error("Error processing message: {}", payload, e);
        }
    }

    private void handleDebeziumMessage(JsonNode jsonNode) {
        String operation = jsonNode.get("op").asText();
        log.info("Debezium operation type: {}", operation);
        
        switch (operation) {
            case "c":
                handleCreateOperation(jsonNode.get("after"));
                break;
            case "u": // Update
                handleCreateOperation(jsonNode.get("after"));
                break;
            case "d": // Delete
                handleDeleteOperation(jsonNode.get("before"));
                break;
            default:
                log.info("Unhandled operation type: {}", operation);
        }
    }

    private void handleMongoMessage(JsonNode jsonNode) {
        try {
            boolean isDeleted = jsonNode.has("__deleted") && jsonNode.get("__deleted").asBoolean();
            
            if (isDeleted) {
                String id = jsonNode.get("_id").asText();
                postSearchRepository.deleteById(id);
                log.info("Post document deleted from Elasticsearch: {}", id);
            } else {
                PostDocument postDocument = convertToPostDocument(jsonNode);
                postSearchRepository.save(postDocument);
                log.info("Post document saved in Elasticsearch: {}", postDocument.getId());
            }
        } catch (Exception e) {
            log.error("Error handling mongo message", e);
        }
    }

    private void handleCreateOperation(JsonNode documentNode) {
        try {
            PostDocument postDocument = convertToPostDocument(documentNode);
            postSearchRepository.save(postDocument);
        } catch (Exception e) {
            log.error("Error handling create operation", e);
        }
    }

    private void handleDeleteOperation(JsonNode documentNode) {
        try {
            String postId = documentNode.get("_id").asText();
            postSearchRepository.deleteById(postId);
        } catch (Exception e) {
            log.error("Error handling delete operation", e);
        }
    }

    private PostDocument convertToPostDocument(JsonNode jsonNode) throws Exception {
        long createdAtMillis = jsonNode.get("createdAt").asLong();
        long updatedAtMillis = jsonNode.get("updatedAt").asLong();
        
        return PostDocument.builder()
                .id(jsonNode.get("_id").asText())
                .userId(jsonNode.get("userId").asText())
                .content(jsonNode.get("content").asText())
                .imageUrls(objectMapper.convertValue(jsonNode.get("imageUrls"), List.class))
                .tags(objectMapper.convertValue(jsonNode.get("tags"), List.class))
                .privacyLevel(jsonNode.get("privacyLevel").asText())
                .createdAt(LocalDateTime.ofInstant(
                        Instant.ofEpochMilli(createdAtMillis),
                        ZoneOffset.UTC))
                .updatedAt(LocalDateTime.ofInstant(
                        Instant.ofEpochMilli(updatedAtMillis),
                        ZoneOffset.UTC))
                .build();
    }
}
