package com.julytus.profileService.utils;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UserLoginInfo {
    private String username;
    private String token;
    private String userId;
    private String role;
}