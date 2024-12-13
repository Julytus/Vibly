package com.julytus.PostService.utils;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;

@Service
public class SecurityUtil {
    /**
     * Get the login of the current user.
     *
     * @return the login of the current user.
     */
    public static Optional<UserLoginInfo> getCurrentUserLogin() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        Authentication authentication = securityContext.getAuthentication();

        if(authentication instanceof JwtAuthenticationToken jwtAuthenticationToken) {
            Jwt jwt = jwtAuthenticationToken.getToken();

            String username = jwtAuthenticationToken.getName();
            String token = ((JwtAuthenticationToken) authentication).getToken().getTokenValue();
            String userId = jwt.getClaim("userId");
            String role = jwt.getClaim("role");
            return Optional.of(new UserLoginInfo(username, role, token, userId));
        }
        return Optional.empty();
    }

    public static String getCurrentUserId() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        Authentication authentication = securityContext.getAuthentication();

        if(authentication instanceof JwtAuthenticationToken jwtAuthenticationToken) {
            Jwt jwt = jwtAuthenticationToken.getToken();
            return jwt.getClaim("userId");
        }
        return null;
    }

    private static String extractPrincipal(Authentication authentication) {
        if (authentication == null) {
            return null;
        } else if (authentication.getPrincipal() instanceof UserDetails springSecurityUser) {
            return springSecurityUser.getUsername();
        } else if (authentication.getPrincipal() instanceof Jwt jwt) {
            return jwt.getSubject();
        } else if (authentication.getPrincipal() instanceof String s) {
            return s;
        }
        return null;
    }

    /**
     * Get the JWT of the current user.
     *
     * @return the JWT of the current user.
     */
    public static Optional<String> getCurrentUserJWT() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        return Optional.ofNullable(securityContext.getAuthentication())
                .filter(authentication -> authentication.getCredentials() instanceof String)
                .map(authentication -> (String) authentication.getCredentials());
    }
}
