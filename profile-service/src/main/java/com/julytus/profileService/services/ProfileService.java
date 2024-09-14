package com.julytus.profileService.services;

import com.julytus.profileService.exceptions.DataNotFoundException;
import com.julytus.profileService.models.dto.request.ProfileCreationRequest;
import com.julytus.profileService.models.dto.response.UserProfileResponse;
import com.julytus.profileService.models.entity.UserProfile;
import com.julytus.profileService.repositories.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final UserProfileRepository userProfileRepository;
    private final ModelMapper modelMapper;
    public UserProfileResponse newProfile(ProfileCreationRequest request) {
        UserProfile userProfile = modelMapper.map(request, UserProfile.class);
        userProfileRepository.save(userProfile);
        return modelMapper.map(userProfile, UserProfileResponse.class);
    }

    public UserProfileResponse getProfile(String username) throws DataNotFoundException {
        UserProfile userProfile = userProfileRepository.findByUsername(username)
                .orElseThrow(() -> new DataNotFoundException("Profile not exist, username: " + username));
        return modelMapper.map(userProfile, UserProfileResponse.class);
    }
}
