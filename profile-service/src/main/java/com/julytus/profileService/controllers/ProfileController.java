package com.julytus.profileService.controllers;

import com.julytus.event.dto.BasicProfile;
import com.julytus.profileService.exceptions.DataNotFoundException;
import com.julytus.profileService.models.dto.request.ProfileCreationRequest;
import com.julytus.profileService.models.dto.response.UserProfileResponse;
import com.julytus.profileService.models.entity.UserProfile;
import com.julytus.profileService.services.ProfileInfoService;
import com.julytus.profileService.services.ProfileService;
import com.julytus.profileService.utils.SecurityUtil;
import com.julytus.profileService.utils.UserLoginInfo;
import io.minio.errors.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Paths;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

import static org.springframework.http.ResponseEntity.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Slf4j
public class ProfileController {
    private final ProfileService profileService;
    private final ModelMapper modelMapper;
    private final ProfileInfoService profileInfoService;

    @PostMapping("")
    public ResponseEntity<UserProfileResponse> newProfile(
            @Valid @RequestBody ProfileCreationRequest request
            ) {
        log.info("New Profile with username: {}", request.getUsername());
        UserProfileResponse response = profileService.newProfile(request);
        return ok().body(response);
    }

    @PutMapping("")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @Valid @RequestBody ProfileCreationRequest request
    ) throws DataNotFoundException {
        UserProfileResponse response = profileService.updateProfile(request);
        return ok().body(response);
    }

    @PostMapping("/avatar/{userId}")
    public ResponseEntity<UserProfileResponse> updateAvatar(
            @RequestBody MultipartFile file,
            @PathVariable String userId
    ) throws DataNotFoundException, IOException, ServerException,
            InsufficientDataException, ErrorResponseException, NoSuchAlgorithmException,
            InvalidKeyException, InvalidResponseException, XmlParserException, InternalException {
        UserProfile userProfile = profileInfoService.setAvatar(userId, file);
        UserProfileResponse response = modelMapper.map(userProfile, UserProfileResponse.class);
        return ok().body(response);
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<UserProfileResponse> getProfileById(
            @PathVariable String id
    ) throws DataNotFoundException {
        UserProfile userProfile = profileService.getProfileById(id);
        UserProfileResponse response = modelMapper.map(userProfile, UserProfileResponse.class);
        return ok().body(response);
    }

    @GetMapping("")
    public ResponseEntity<UserProfileResponse> fetchAccount() throws DataNotFoundException {
        UserLoginInfo user = SecurityUtil.getCurrentUserLogin();
        UserProfileResponse response = profileService.getProfileByUsername(user.getUsername());
        response.setRole("ROLE_" + user.getRole());
        return ok().body(response);
    }

    @GetMapping("/{username}")
    public ResponseEntity<UserProfileResponse> getProfileByUsername(
            @PathVariable String username
    ) throws DataNotFoundException {
        UserProfileResponse response = profileService.getProfileByUsername(username);
        return ok().body(response);
    }

    @GetMapping("/avatar/{id}")
    public ResponseEntity<?> getAvatarById(@PathVariable String id) {
        try {
            String url = profileInfoService.getAvatarById(id);
            java.nio.file.Path imagePath = Paths.get("uploads/avatar/" + url);
            UrlResource resource = new UrlResource(imagePath.toUri());

            if (resource.exists()) {
                return ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .body(resource);
            } else {
                return ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .body(new UrlResource(Paths.      get("uploads/image-not-found.jpg").toUri()));
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/background/{id}")
    public ResponseEntity<?> getBackgroundById(@PathVariable String id) {
        try {
            String url = profileInfoService.getBackgroundById(id);
            java.nio.file.Path imagePath = Paths.get("uploads/background/" + url);
            UrlResource resource = new UrlResource(imagePath.toUri());

            if (resource.exists()) {
                return ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .body(resource);
            } else {
                return ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .body(new UrlResource(Paths.      get("uploads/image-not-found.jpg").toUri()));
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/basic/u/{username}")
    public ResponseEntity<BasicProfile> getBasicProfile(@PathVariable String username) throws DataNotFoundException {
        return ResponseEntity.ok(profileInfoService.getBasicProfile(username));
    }

    @GetMapping("/basic/id/{id}")
    public ResponseEntity<BasicProfile> getBasicProfileById(@PathVariable String id) throws DataNotFoundException {
        return ResponseEntity.ok(profileInfoService.getBasicProfileById(id));
    }

    @DeleteMapping("")
    public ResponseEntity<Void> deleteAllProfiles() {
        profileService.deleteAllProfiles();
        return noContent().build();
    }
}
