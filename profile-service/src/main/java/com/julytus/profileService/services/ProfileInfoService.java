package com.julytus.profileService.services;

import com.julytus.event.dto.BasicProfile;
import com.julytus.profileService.exceptions.DataNotFoundException;
import com.julytus.profileService.models.entity.UserProfile;
import com.julytus.profileService.repositories.UserProfileRepository;
import com.julytus.profileService.utils.FileUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class ProfileInfoService {
    private final ProfileService profileService;
    private final UserProfileRepository userProfileRepository;

    public UserProfile setAvatar(String userId, MultipartFile file)
            throws DataNotFoundException, IOException {
        UserProfile userProfile = profileService.getProfileById(userId);
        String uploadsFolder = "uploads/avatar";
        userProfile.setAvatar(FileUtil.updateImage(userProfile, file, uploadsFolder));
        return userProfileRepository.save(userProfile);
    }

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

    public BasicProfile getBasicProfileById(String id) throws DataNotFoundException {
        UserProfile userProfile = profileService.getProfileById(id);

        return BasicProfile.builder()
                .id(userProfile.getId())
                .avatar(userProfile.getAvatar())
                .firstName(userProfile.getFirstName())
                .lastName(userProfile.getLastName())
                .build();
    }

    public String getAvatarById(String id) throws DataNotFoundException {
        UserProfile userProfile = profileService.getProfileById(id);
        return userProfile.getAvatar();
    }

    public String getBackgroundById(String id) throws DataNotFoundException {
        UserProfile userProfile = profileService.getProfileById(id);
        return userProfile.getBackground();
    }

}
