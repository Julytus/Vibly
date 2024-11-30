package com.julytus.ChatService.controllers;

import com.julytus.ChatService.exceptions.DataNotFoundException;
import com.julytus.ChatService.models.dto.request.ConversationRequest;
import com.julytus.ChatService.models.dto.response.PageResponse;
import com.julytus.ChatService.models.entity.Conversation;
import com.julytus.ChatService.services.ConversationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/conversation")
@RequiredArgsConstructor
public class ConversationController {
    private final ConversationService conversationService;
    @PostMapping("")
    public ResponseEntity<Conversation> openConversation(@RequestBody ConversationRequest request) {
        Conversation conversation = conversationService.openConversation(request);
        return ResponseEntity.ok(conversation);
    }

    @GetMapping("/{conversationId}")
    public ResponseEntity<Conversation> getConversationById(
            @RequestHeader("Authorization") String token,
            @PathVariable String conversationId)
            throws DataNotFoundException {
        String jwtToken = token.startsWith("Bearer ") ? token.substring(7) : token;
        Conversation conversation = conversationService.findById( conversationId);
        conversationService.verifyUserAccess(jwtToken, conversation);
        return ResponseEntity.ok(conversation);
    }

    @GetMapping
    public PageResponse<Conversation> getConversations(
            @RequestHeader("Authorization") String token,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam String userId
    ) {
        String jwtToken = token.startsWith("Bearer ") ? token.substring(7) : token;
        return conversationService.findConversationsByUserId(jwtToken, page, size, userId);
    }

}
