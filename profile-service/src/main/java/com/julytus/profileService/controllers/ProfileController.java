package com.julytus.profileService.controllers;

import com.julytus.profileService.exceptions.DataNotFoundException;
import com.julytus.profileService.models.dto.request.ProfileCreationRequest;
import com.julytus.profileService.models.dto.response.UserProfileResponse;
import com.julytus.profileService.services.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/info")
@RequiredArgsConstructor
@Slf4j
public class ProfileController {
    private final ProfileService profileService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("")
    public ResponseEntity<UserProfileResponse> newProfile(
            @Valid @RequestBody ProfileCreationRequest request
            ) {
        log.info("New Profile with username: " + request.getUsername());
        UserProfileResponse response = profileService.newProfile(request);
        return ResponseEntity.ok().body(response);
    }

//    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping("/{username}")
    public ResponseEntity<UserProfileResponse> getProfile(
            @PathVariable String username
    ) throws DataNotFoundException {
        UserProfileResponse response = profileService.getProfile(username);
        return ResponseEntity.ok().body(response);
    }
}
