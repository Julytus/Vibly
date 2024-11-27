package com.julytus.ChatService.controllers;

import com.julytus.ChatService.exceptions.DataNotFoundException;
import com.julytus.ChatService.models.dto.request.MessageRequest;
import com.julytus.ChatService.models.dto.response.PageResponse;
import com.julytus.ChatService.models.entity.Message;
import com.julytus.ChatService.services.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/message")
public class MessageController {
    private final MessageService messageService;

    @PostMapping("")
    public ResponseEntity<Message> sendMessage(@RequestBody MessageRequest request)
            throws DataNotFoundException {
        return ResponseEntity.ok(messageService.sendMessage(request));
    }

    @GetMapping("/{conversationId}")
    public ResponseEntity<PageResponse<Message>> getMessageByConversationId(
            @PathVariable String conversationId,
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(messageService.findMessagesByConversationId(page, size, conversationId));
    }
}
