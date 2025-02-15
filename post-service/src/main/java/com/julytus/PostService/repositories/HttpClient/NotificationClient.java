package com.julytus.PostService.repositories.HttpClient;

import com.julytus.PostService.configurations.AuthenticationRequestInterceptor;
import com.julytus.event.dto.NotificationEvent;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(
        name = "notification-service",
        url = "${feign.client.config.notification-service.url}",
        configuration = {AuthenticationRequestInterceptor.class}
)
public interface NotificationClient {
    @PutMapping("/friend/request/{id}")
    Void updateRequestAccepted(@PathVariable("id") String id);

    @DeleteMapping("/friend/request/{id}")
    Void deleteNotification(@PathVariable("id") String id);

    @PostMapping("/friend/request")
    Void createNotification(NotificationEvent message);
}