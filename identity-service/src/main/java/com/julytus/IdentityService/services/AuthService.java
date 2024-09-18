package com.julytus.IdentityService.services;

import com.julytus.IdentityService.constants.PredefinedRole;
import com.julytus.IdentityService.exceptions.DataNotFoundException;
import com.julytus.IdentityService.models.dto.request.IntrospectRequest;
import com.julytus.IdentityService.models.dto.request.LoginRequest;
import com.julytus.IdentityService.models.dto.request.ProfileCreationRequest;
import com.julytus.IdentityService.models.dto.request.RegisterRequest;
import com.julytus.IdentityService.models.dto.response.IntrospectResponse;
import com.julytus.IdentityService.models.entity.User;
import com.julytus.IdentityService.repositories.HttpClient.ProfileClient;
import com.julytus.IdentityService.repositories.RoleRepository;
import com.julytus.IdentityService.repositories.UserRepository;
import com.julytus.IdentityService.utils.JwtTokenUtil;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserService userService;
    private final UserRepository userRepository;
    private final JwtTokenUtil jwtTokenUtil;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final ProfileClient profileClient;

    public String login(LoginRequest loginRequest) throws Exception {
        User currentUser = userService.findByUsername(loginRequest.getUsername());
        if (!currentUser.isActive()) {
            throw new DataNotFoundException("User is locked");
        }
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword());

        // authenticate with Java Spring security
        try {
            // authenticate with Java Spring security
            Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            return jwtTokenUtil.createAccessToken(currentUser);
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Wrong password");
        }
    }
    public IntrospectResponse introspect(IntrospectRequest request) {
        boolean isValid = jwtTokenUtil.verifyToken(request.getToken());
        return IntrospectResponse.builder().valid(isValid).build();
    }

    public User register(RegisterRequest registerRequest) {
        String username = registerRequest.getUsername();
        if (userRepository.existsByUsername(username)) {
            throw new DataIntegrityViolationException("Username already exists");
        }

        User newUser = User.builder()
                .active(true)
                .username(registerRequest.getUsername())
                .password(registerRequest.getPassword())
                .role(roleRepository.getRoleByName(PredefinedRole.USER_ROLE))
                .build();

        // passwordEncode
        String password = registerRequest.getPassword();
        String encodedPassword = passwordEncoder.encode(password);
        newUser.setPassword(encodedPassword);

        ProfileCreationRequest request = ProfileCreationRequest
                .builder()
                .username(registerRequest.getUsername())
                .firstName(registerRequest.getFirstName())
                .lastName(registerRequest.getLastName())
                .build();
        profileClient.createProfile(request);

        return userRepository.save(newUser);
    }
}
