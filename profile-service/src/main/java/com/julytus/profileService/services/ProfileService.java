package com.julytus.profileService.services;

import com.julytus.profileService.exceptions.DataNotFoundException;
import com.julytus.profileService.models.dto.request.ProfileCreationRequest;
import com.julytus.profileService.models.dto.response.UserProfileResponse;
import com.julytus.profileService.models.entity.UserProfile;
import com.julytus.profileService.repositories.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProfileService {
    private final UserProfileRepository userProfileRepository;
    private final ModelMapper modelMapper;

    public UserProfileResponse newProfile(ProfileCreationRequest request) {
        request.setAvatar("avatar-default.jpg");
        request.setBackground("bg-default.jpg");
        UserProfile userProfile = modelMapper.map(request, UserProfile.class);
        userProfileRepository.save(userProfile);
        return modelMapper.map(userProfile, UserProfileResponse.class);
    }

    public UserProfileResponse getProfileByUsername(String username) throws DataNotFoundException {
        UserProfile userProfile = userProfileRepository.findByUsername(username)
                .orElseThrow(() -> new DataNotFoundException("Profile not exist, username: " + username));
        return modelMapper.map(userProfile, UserProfileResponse.class);
    }

    @Cacheable(value = "userProfiles", key = "#id", unless = "#result == null")
    public UserProfile getProfileById(String id) throws DataNotFoundException {
         return userProfileRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Profile not exist, id: " + id));
    }

    public void deleteAllProfiles() {
        userProfileRepository.deleteAll();
    }
}
