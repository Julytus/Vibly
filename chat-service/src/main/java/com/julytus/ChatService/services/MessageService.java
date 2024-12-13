package com.julytus.ChatService.services;

import com.julytus.ChatService.models.dto.response.PageResponse;
import com.julytus.event.dto.NotificationEvent;
import com.julytus.event.dto.NotificationType;
import org.springframework.data.domain.PageRequest;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import com.julytus.ChatService.exceptions.DataNotFoundException;
import com.julytus.ChatService.models.dto.request.MessageRequest;
import com.julytus.ChatService.models.entity.Conversation;
import com.julytus.ChatService.models.entity.Message;
import com.julytus.ChatService.repositories.MessageRepository;

import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;
    private final ConversationService conversationService;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public Message sendMessage(MessageRequest request) throws DataNotFoundException {
        Conversation existingConversation = conversationService.findById(request.getConversationId());

        Message newMess = Message
                .builder()
                .content(request.getContent())
                .senderId(request.getSenderId())
                .conversationId(request.getConversationId())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        kafkaTemplate.send("chat-messages", newMess);
        Message message = messageRepository.save(newMess);

        String receiverId = existingConversation.getUserId()
                .stream()
                .filter(id -> !id.equals(request.getSenderId())) // Lấy ID khác với senderId
                .findFirst()
                .orElseThrow(() -> new DataNotFoundException("Receiver not found in conversation"));

        NotificationEvent newNoti = NotificationEvent
                .builder()
                .senderId(request.getSenderId())
                .receiverId(receiverId)
                .conversationId(message.getConversationId())
                .content(message.getContent())
                .type(NotificationType.MESSAGE)
                .referenceId(message.getId())
                .createdAt(message.getCreatedAt())
                .build();
        kafkaTemplate.send("notifications", newNoti);

        conversationService.updateLastMessage(existingConversation, message);
        return message;
    }

    public PageResponse<Message> findMessagesByConversationId(int page, int size, String conversationId) {
        Sort sort = Sort.by("createdAt").descending();
        Pageable pageable = PageRequest.of(page - 1, size, sort);
        Page<Message> pageData = messageRepository.findByConversationId(conversationId, pageable);

        return PageResponse.<Message>builder()
                .currentPage(page)
                .pageSize(pageData.getSize())
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .data(pageData.getContent())
                .build();
    }
}
