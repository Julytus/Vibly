package com.julytus.profileService.services;

import com.julytus.event.dto.BasicProfile;
import com.julytus.profileService.exceptions.DataNotFoundException;
import com.julytus.profileService.models.dto.request.ProfileCreationRequest;
import com.julytus.profileService.models.dto.response.UserProfileResponse;
import com.julytus.profileService.models.entity.UserProfile;
import com.julytus.profileService.repositories.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

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

    public UserProfileResponse getProfileById(String id) throws DataNotFoundException {
        UserProfile userProfile = userProfileRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Profile not exist, id: " + id));
        return modelMapper.map(userProfile, UserProfileResponse.class);
    }

    public String getAvatarByIb(String id) {
        return userProfileRepository.findById(id).get().getAvatar();
    }

    public String getBackgroundByIb(String id) {
        return userProfileRepository.findById(id).get().getBackground();
    }

    @Cacheable(value = "userProfiles", key = "#username", unless = "#result == null")
    public BasicProfile getBasicProfile(String username) throws DataNotFoundException {
        UserProfile userProfile = userProfileRepository.findByUsername(username)
                .orElseThrow(() -> new DataNotFoundException("Profile not exist, username: " + username));
        return BasicProfile.builder()
                .id(userProfile.getId())
                .avatar(userProfile.getAvatar())
                .firstName(userProfile.getFirstName())
                .lastName(userProfile.getLastName())
                .build();
    }

    @Cacheable(value = "userProfiles", key = "#id", unless = "#result == null")
    public BasicProfile getBasicProfileById(String id) throws DataNotFoundException {
        UserProfile userProfile = userProfileRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Profile not exist, username: " + id));
        return BasicProfile.builder()
                .id(userProfile.getId())
                .avatar(userProfile.getAvatar())
                .firstName(userProfile.getFirstName())
                .lastName(userProfile.getLastName())
                .build();
    }

    public void deleteAllProfiles() {
        userProfileRepository.deleteAll();
    }
}
