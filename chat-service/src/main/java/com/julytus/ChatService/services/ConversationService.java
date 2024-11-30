package com.julytus.ChatService.services;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.julytus.ChatService.exceptions.DataNotFoundException;
import com.julytus.ChatService.exceptions.UnauthorizedException;
import com.julytus.ChatService.models.dto.request.ConversationRequest;
import com.julytus.ChatService.models.dto.response.PageResponse;
import com.julytus.ChatService.models.entity.Conversation;
import com.julytus.ChatService.models.entity.Message;
import com.julytus.ChatService.repositories.ConversationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ConversationService {
    private final ConversationRepository conversationRepository;
    private final JwtService jwtService;

    public void verifyUserAccess(String token, Conversation conversation) {
        String userId = jwtService.getUserIdFromToken(token);
        
        if (!conversation.getUserId().contains(userId)) {
            throw new UnauthorizedException("User does not have access to this conversation");
        }
    }

    public Conversation findById(String id) throws DataNotFoundException {
        return conversationRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Conversation with id " + id + " not found"));
    }

    public Conversation openConversation(ConversationRequest request) {
        Conversation existingConversation =conversationRepository
                .findByTwoUsers(request.getSenderId(), request.getReceiverId());

        if( existingConversation != null) {
            verifyUserAccess(request.getToken(), existingConversation);
            return existingConversation;
        } else {
            Set<String> users = new HashSet<>();
            users.add(request.getSenderId());
            users.add(request.getReceiverId());
            
            Conversation conversation = Conversation
                    .builder()
                    .name("")
                    .isGroup(false)
                    .userId(users)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            return conversationRepository.save(conversation);
        }
    }

    public PageResponse<Conversation> findConversationsByUserId(
            String token, int page, int size, String userId) {
        String tokenUserId = jwtService.getUserIdFromToken(token);
        if (!tokenUserId.equals(userId)) {
            throw new UnauthorizedException("User is not authorized to access these conversations");
        }

        Sort sort = Sort.by("updatedAt").descending();
        Pageable pageable = PageRequest.of(page - 1, size, sort);
        String[] userIds = new String[]{userId};
        var pageData = conversationRepository.findByUserIdContaining(userIds, pageable);

        return PageResponse.<Conversation>builder()
                .currentPage(page)
                .pageSize(pageData.getSize())
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .data(pageData.getContent())
                .build();
    }

    public void updateLastMessage(Conversation conversation, Message message) {
        conversation.setLastMessage(message);
        conversation.setUpdatedAt(LocalDateTime.now());
        conversationRepository.save(conversation);
    }
}
