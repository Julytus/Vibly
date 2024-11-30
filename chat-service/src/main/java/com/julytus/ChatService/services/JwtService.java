package com.julytus.ChatService.services;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Service;

import com.julytus.ChatService.exceptions.UnauthorizedException;
import com.nimbusds.jose.util.Base64;

@Service
public class JwtService {
    
    @Value("${jwt.secret-key-access-token}")
    private String secretKeyAccessToken;

    private static final MacAlgorithm JWT_ALGORITHM = MacAlgorithm.HS256;
    
    private final Logger log = LoggerFactory.getLogger(JwtService.class);

    private SecretKey getAccessTokenSecretKey() {
        byte[] keyBytes = Base64.from(secretKeyAccessToken).decode();
        return new SecretKeySpec(keyBytes, 0, keyBytes.length, JWT_ALGORITHM.getName());
    }

    private JwtDecoder getJwtDecoder() {
        return NimbusJwtDecoder.withSecretKey(getAccessTokenSecretKey())
                .macAlgorithm(JWT_ALGORITHM)
                .build();
    }

    public String getUserIdFromToken(String token) {
        try {
            var jwt = getJwtDecoder().decode(token);
            return jwt.getClaim("userId");
        } catch (JwtException e) {
            log.error("Token validation failed: {}", e.getMessage());
            throw new UnauthorizedException("Invalid token");
        }
    }

    public boolean validateToken(String token) {
        try {
            getJwtDecoder().decode(token);
            return true;
        } catch (JwtException e) {
            log.error("Token validation failed: {}", e.getMessage());
            return false;
        }
    }
} 