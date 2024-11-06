package com.julytus.profileService.controllers;

import com.julytus.event.dto.BasicProfile;
import com.julytus.profileService.exceptions.DataNotFoundException;
import com.julytus.profileService.models.dto.request.ProfileCreationRequest;
import com.julytus.profileService.models.dto.response.UserProfileResponse;
import com.julytus.profileService.models.entity.UserProfile;
import com.julytus.profileService.services.ProfileService;
import com.julytus.profileService.utils.SecurityUtil;
import com.julytus.profileService.utils.UserLoginInfo;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.InvalidBearerTokenException;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Paths;
import java.util.Optional;

import static org.springframework.http.ResponseEntity.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Slf4j
public class ProfileController {
    private final ProfileService profileService;

    @PostMapping("")
    public ResponseEntity<UserProfileResponse> newProfile(
            @Valid @RequestBody ProfileCreationRequest request
            ) {
        log.info("New Profile with username: " + request.getUsername());
        UserProfileResponse response = profileService.newProfile(request);
        return ok().body(response);
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<UserProfileResponse> getProfileById(
            @PathVariable String id
    ) throws DataNotFoundException {
        UserProfileResponse response = profileService.getProfileById(id);
        return ok().body(response);
    }

    @GetMapping("")
    public ResponseEntity<UserProfileResponse> fetchAccount() throws DataNotFoundException {
        Optional<UserLoginInfo> user = SecurityUtil.getCurrentUserLogin();
        if (user.isEmpty()) {
            throw new InvalidBearerTokenException("Invalid token");
        }
        UserProfileResponse response = profileService.getProfileByUsername(user.get().getUsername());
        response.setRole("ROLE_" + user.get().getRole());
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
            String url = profileService.getAvatarByIb(id);
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
            String url = profileService.getBackgroundByIb(id);
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
        return ResponseEntity.ok(profileService.getBasicProfile(username));
    }

    @GetMapping("/basic/id/{id}")
    public ResponseEntity<BasicProfile> getBasicProfileById(@PathVariable String id) throws DataNotFoundException {
        return ResponseEntity.ok(profileService.getBasicProfile(id));
    }

    @DeleteMapping("")
    public ResponseEntity<Void> deleteAllProfiles() {
        profileService.deleteAllProfiles();
        return noContent().build();
    }
}
