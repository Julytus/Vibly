package com.julytus.profileService.repositories.HttpClient;

import com.julytus.profileService.configurations.AuthenticationRequestInterceptor;
import com.julytus.profileService.models.dto.request.ConversationRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;

@FeignClient(
        name = "chat-service",
        url = "${feign.client.config.chat-service.url}",
        configuration = {AuthenticationRequestInterceptor.class}
)
public interface ChatClient {
    @PostMapping("/conversation")
    Void openOrCreateConversation(ConversationRequest request);
}