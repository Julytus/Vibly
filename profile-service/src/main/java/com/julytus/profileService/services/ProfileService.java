package com.julytus.profileService.services;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.julytus.profileService.exceptions.DataNotFoundException;
import com.julytus.profileService.models.dto.request.ProfileCreationRequest;
import com.julytus.profileService.models.dto.response.UserProfileResponse;
import com.julytus.profileService.models.entity.UserProfile;
import com.julytus.profileService.repositories.UserProfileRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProfileService {
    private final UserProfileRepository userProfileRepository;
    private final ModelMapper modelMapper;
    
    @Value("${image.avatar-default}")
    private String defaultAvatar;
    
    @Value("${image.bg-default}")
    private String defaultBackground;

    public UserProfileResponse newProfile(ProfileCreationRequest request) {
        request.setAvatar(defaultAvatar);
        request.setBackground(defaultBackground);
        UserProfile userProfile = modelMapper.map(request, UserProfile.class);
        userProfileRepository.save(userProfile);
        return modelMapper.map(userProfile, UserProfileResponse.class);
    }

    public UserProfileResponse updateProfile(ProfileCreationRequest request) throws DataNotFoundException {
        UserProfile userProfile = userProfileRepository.findById(request.getId())
                .orElseThrow(() -> new DataNotFoundException("Profile not exist, username: " + request.getId()));
        userProfile.setCity(request.getCity());
        userProfile.setDateOfBirth(request.getDateOfBirth());
        userProfile.setFirstName(request.getFirstName());
        userProfile.setLastName(request.getLastName());
        userProfile.setGender(request.getGender());

        userProfileRepository.save(userProfile);
        return modelMapper.map(userProfile, UserProfileResponse.class);
    }

    public UserProfileResponse getProfileByUsername(String username) throws DataNotFoundException {
        UserProfile userProfile = userProfileRepository.findByUsername(username)
                .orElseThrow(() -> new DataNotFoundException("Profile not exist, username: " + username));
        return modelMapper.map(userProfile, UserProfileResponse.class);
    }

    public UserProfile getProfileById(String id) throws DataNotFoundException {
         return userProfileRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Profile not exist, id: " + id));
    }

    public void deleteAllProfiles() {
        userProfileRepository.deleteAll();
    }
}
