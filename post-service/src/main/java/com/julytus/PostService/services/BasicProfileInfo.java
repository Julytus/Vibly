package com.julytus.PostService.services;

import com.julytus.PostService.repositories.HttpClient.ProfileClient;
import com.julytus.event.dto.BasicProfile;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BasicProfileInfo {
    private final ProfileClient profileClient;

    @Cacheable(value = "userProfiles", key = "#username", unless = "#result == null")
    public BasicProfile getBasicProfileByUsername(String username) {
        return profileClient.getProfileByUsername(username);
    }
}
