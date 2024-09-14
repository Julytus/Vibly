package com.julytus.IdentityService.services;

import com.julytus.IdentityService.exceptions.DataNotFoundException;
import com.julytus.IdentityService.exceptions.ExpiredTokenException;
import com.julytus.IdentityService.models.entity.User;
import com.julytus.IdentityService.repositories.UserRepository;
import com.julytus.IdentityService.utils.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final JwtTokenUtil jwtTokenUtil;

    public User findByUsername(String username) throws DataNotFoundException {
        return userRepository.findByUsername(username).orElseThrow(() -> new DataNotFoundException("User not found"));
    }

    public User getUserById(Long id) throws DataNotFoundException {
        return userRepository.findById(id).orElseThrow(() -> new DataNotFoundException("User not found!"));
    }

    public User getUserDetailsFromAccessToken(String token) throws ExpiredTokenException, DataNotFoundException {
        if (jwtTokenUtil.isAccessTokenExpired(token)) {
            throw new ExpiredTokenException("Access token is expired");
        }
        String username = jwtTokenUtil.extractUsernameFromAccessToken(token);
        return userRepository.findByUsername(username).orElseThrow(() -> new DataNotFoundException("User not found"));
    }

}
