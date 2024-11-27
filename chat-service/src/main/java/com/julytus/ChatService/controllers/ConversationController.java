package com.julytus.ChatService.controllers;

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

    @GetMapping("")
    ResponseEntity<PageResponse<Conversation>> getPostsByUserId(
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int size,
            @RequestParam(value = "userId") String userId
    ){
        System.out.println("Received userId: " + userId);
        return ResponseEntity.ok(conversationService.findConversationsByUserId(page, size, userId));
    }

}
