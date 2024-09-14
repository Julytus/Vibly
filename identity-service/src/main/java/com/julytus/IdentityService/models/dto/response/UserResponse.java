package com.julytus.IdentityService.models.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponse extends BaseResponse {
    @JsonProperty("id")
    private Long id;

    @JsonProperty("is_active")
    private boolean active;

    @JsonProperty("username")
    private String username;

    @JsonProperty("role")
    private String role;
}
