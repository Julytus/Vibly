package com.julytus.PostService.repositories.HttpClient;

import com.julytus.PostService.configurations.AuthenticationRequestInterceptor;
import com.julytus.event.dto.BasicProfile;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "profile-service",
        url = "${feign.client.config.profile-service.url}",
        configuration = {AuthenticationRequestInterceptor.class}
)
public interface ProfileClient {
    @GetMapping("/users/basic/u/{username}")
    BasicProfile getProfileByUsername(@PathVariable("username") String username);
}