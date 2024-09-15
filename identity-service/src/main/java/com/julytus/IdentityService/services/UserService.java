package com.julytus.IdentityService.services;

import com.julytus.IdentityService.exceptions.DataNotFoundException;
import com.julytus.IdentityService.mappers.UserResponseMapper;
import com.julytus.IdentityService.models.dto.response.UserResponse;
import com.julytus.IdentityService.models.entity.User;
import com.julytus.IdentityService.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final UserRepository userRepository;

    public User findByUsername(String username) throws DataNotFoundException {
        return userRepository.findByUsername(username).orElseThrow(() -> new DataNotFoundException("User not found"));
    }

    public User getUserById(Long id) throws DataNotFoundException {
        return userRepository.findById(id).orElseThrow(() -> new DataNotFoundException("User not found!"));
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream().map(UserResponseMapper::fromUser).toList();
    }
}
