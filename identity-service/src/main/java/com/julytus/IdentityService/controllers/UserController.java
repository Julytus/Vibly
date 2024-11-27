package com.julytus.IdentityService.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.julytus.IdentityService.exceptions.DataNotFoundException;
import com.julytus.IdentityService.mappers.UserResponseMapper;
import com.julytus.IdentityService.models.dto.response.UserResponse;
import com.julytus.IdentityService.models.entity.User;
import com.julytus.IdentityService.services.UserService;

import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable("userId") String userId) throws DataNotFoundException {
        User user = userService.getUserById(userId);
        return ResponseEntity.ok().body(UserResponseMapper.fromUser(user));
    }

    @GetMapping("/all")
    public ResponseEntity<List<UserResponse>> getUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
}
