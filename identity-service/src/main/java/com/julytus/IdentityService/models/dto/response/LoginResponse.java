package com.julytus.IdentityService.models.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LoginResponse {
    String token;

    @JsonProperty("refresh_token")
    String refreshToken;

    String tokenType = "Bearer";
    // user's detail
    String id;
    String username;
    String role;
    @JsonProperty("user_profile")
    UserProfileResponse userProfile;
}
