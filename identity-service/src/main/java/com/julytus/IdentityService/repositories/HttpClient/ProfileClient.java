package com.julytus.IdentityService.repositories.HttpClient;

import com.julytus.IdentityService.configurations.AuthenticationRequestInterceptor;
import com.julytus.IdentityService.models.dto.request.ProfileCreationRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;

@FeignClient(
        name = "profile-service",
        url = "${feign.client.config.profile-service.url}",
        configuration = {AuthenticationRequestInterceptor.class}
)
public interface ProfileClient {
    @PostMapping("/users")
    void createProfile(ProfileCreationRequest request);
}