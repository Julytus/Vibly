package com.julytus.IdentityService.utils;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UserLoginInfo {
    private String username;
    private String role;
    private String token;
}