package com.julytus.PostProcessor.clients;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(
        name = "profile-service",
        url = "${feign.client.config.profile-service.url}"
)
public interface ProfileClient {
    @GetMapping("/friends/listId")
    List<String> getFollowerIds(@RequestParam String userId);
} 