package com.julytus.IdentityService.mappers;


import com.julytus.IdentityService.models.dto.response.UserResponse;
import com.julytus.IdentityService.models.entity.User;

public class UserResponseMapper {
    public static UserResponse fromUser(User user) {
        UserResponse userResponse = UserResponse.builder()
                .id(user.getId())
                .active(user.isActive())
                .role(user.getRole().getName())
                .username(user.getUsername())
                .build();
        userResponse.setCreatedAt(user.getCreatedAt());
        userResponse.setUpdatedAt(user.getUpdatedAt());
        return userResponse;
    }
}
