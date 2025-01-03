package com.julytus.PostService.repositories.HttpClient;

import com.julytus.PostService.configurations.AuthenticationRequestInterceptor;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(
        name = "profile-service",
        url = "${feign.client.config.profile-service.url}",
        configuration = {AuthenticationRequestInterceptor.class}
)
public interface ProfileClient {
    @GetMapping("/friends/checkFriend")
    Boolean checkFriend(
            @RequestParam String friendId,
            @RequestParam String userId);
}