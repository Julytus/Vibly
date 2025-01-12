package com.julytus.IdentityService.controllers;

import com.julytus.IdentityService.utils.SecurityUtil;
import com.julytus.IdentityService.utils.UserLoginInfo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import com.julytus.IdentityService.mappers.UserResponseMapper;
import com.julytus.IdentityService.models.dto.request.IntrospectRequest;
import com.julytus.IdentityService.models.dto.request.LoginRequest;
import com.julytus.IdentityService.models.dto.request.RegisterRequest;
import com.julytus.IdentityService.models.dto.response.IntrospectResponse;
import com.julytus.IdentityService.models.dto.response.LoginResponse;
import com.julytus.IdentityService.models.dto.response.ResponseObject;
import com.julytus.IdentityService.models.entity.Token;
import com.julytus.IdentityService.models.entity.User;
import com.julytus.IdentityService.services.AuthService;
import com.julytus.IdentityService.services.TokenService;
import com.julytus.IdentityService.services.UserService;
import com.julytus.IdentityService.utils.JwtTokenUtil;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    private final AuthService authService;
    private final UserService userService;
    private final TokenService tokenService;
    private final JwtTokenUtil jwtTokenUtil;

    @Value("${jwt.expiration-refresh-token}")
    private int expirationRefreshToken;

    //http://localhost:9001/identity/auth/login
    @PostMapping("/login")
    public ResponseEntity<ResponseObject> login(@Valid @RequestBody LoginRequest loginRequest) throws Exception {
        LoginResponse loginResponse = authService.login(loginRequest);

        ResponseCookie resCookies = ResponseCookie.from("refresh_token", loginResponse.getRefreshToken())
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(expirationRefreshToken)
                //.domain("")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, resCookies.toString())
                .body(ResponseObject.builder()
                        .message("Login successfully")
                        .data(loginResponse)
                        .status(HttpStatus.OK)
                        .build());
    }

    //http://localhost:9001/identity/auth/register
    @PostMapping("/register")
    public ResponseEntity<ResponseObject> register(@Valid @RequestBody RegisterRequest registerRequest) {
        log.info("REGISTER {}", registerRequest);
        if (!registerRequest.getRetypePassword().equals(registerRequest.getPassword())) {
            return ResponseEntity.badRequest()
                    .body(ResponseObject.builder()
                            .status(HttpStatus.BAD_REQUEST)
                            .data(null)
                            .message("Password not match")
                            .build());
        }
        User user = authService.register(registerRequest);
        return ResponseEntity.ok(ResponseObject.builder()
                .status(HttpStatus.CREATED)
                .data(UserResponseMapper.fromUser(user))
                .message("register successfully")
                .build());
    }

    @PostMapping("/introspect")
    public ResponseEntity<IntrospectResponse> introspect(@RequestBody IntrospectRequest request) {
        IntrospectResponse response = authService.introspect(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/refresh")
    public ResponseEntity<ResponseObject> getRefreshToken(
            @CookieValue(name = "refresh_token", defaultValue = "What do u want!") String refresh_token) throws Exception {
        Jwt decodedToken = jwtTokenUtil.checkValidRefreshToken(refresh_token);
        String username = decodedToken.getSubject();
        User currentUser = userService.findByUsername(username);

        Token token = tokenService.refreshToken(refresh_token, currentUser);
        LoginResponse loginResponse = fromUserAndToken(currentUser, token);

        ResponseCookie resCookies = ResponseCookie.from("refresh_token", token.getRefreshToken())
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(expirationRefreshToken)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, resCookies.toString())
                .body(ResponseObject.builder()
                        .message("Refresh token successfully!")
                        .data(loginResponse)
                        .status(HttpStatus.OK)
                        .build());
    }

    @PostMapping("/logout")
    public ResponseEntity<ResponseObject> logout() {
        try {
            Optional<UserLoginInfo> userLoginInfo = SecurityUtil.getCurrentUserLogin();
            if (userLoginInfo.isEmpty()) {
                throw new Exception("Invalid token");
            }

            String token = userLoginInfo.get().getToken();
            if (!jwtTokenUtil.verifyToken(token)) {
                throw new Exception("Invalid token");
            }

            ResponseCookie clearRefreshTokenCookie = ResponseCookie.from("refresh_token", "")
                    .httpOnly(true)
                    .secure(true)
                    .path("/")
                    .maxAge(0)
                    .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, clearRefreshTokenCookie.toString())
                    .body(ResponseObject.builder()
                            .message("Logged out successfully")
                            .status(HttpStatus.OK)
                            .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ResponseObject.builder()
                            .message("Invalid token")
                            .status(HttpStatus.UNAUTHORIZED)
                            .build());
        }
    }

    private LoginResponse fromUserAndToken(User user, Token token) {
        return LoginResponse.builder()
                .token(token.getToken())
                .refreshToken(token.getRefreshToken())
                .username(user.getUsername())
                .role(user.getAuthorities().toString())
                .id(user.getId())
                .build();
    }
}
