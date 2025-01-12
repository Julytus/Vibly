package com.julytus.Timeline.client;

import com.julytus.Timeline.dto.BasicProfile;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "profile-service",
        url = "${feign.client.config.profile-service.url}")
public interface ProfileClient {
    @GetMapping("/users/basic/id/{id}")
    BasicProfile getProfile(@PathVariable("id") String id);
}