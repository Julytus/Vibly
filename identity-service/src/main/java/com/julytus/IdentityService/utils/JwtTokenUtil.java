package com.julytus.IdentityService.utils;


import java.time.Instant;
import java.time.temporal.ChronoUnit;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import com.julytus.IdentityService.models.entity.User;
import com.julytus.IdentityService.repositories.TokenRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Component;

import com.nimbusds.jose.util.Base64;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;

import static com.julytus.IdentityService.configurations.SecurityJwtConfig.JWT_ALGORITHM;

@Component
public class JwtTokenUtil {
    @Value("${jwt.expiration-access-token}")
    private int expirationAccessToken;

    @Value("${jwt.expiration-refresh-token}")
    private int expirationRefreshToken;

    @Value("${jwt.secret-key-refresh-token}")
    private String secretKeyRefreshToken;

    private static final Logger logger = LoggerFactory.getLogger(JwtTokenUtil.class);

    private final JwtEncoder accessTokenJwtEncoder;
    private final JwtDecoder accessTokenJwtDecoder;
    private final JwtEncoder refreshTokenJwtEncoder;
    //    private final JwtDecoder refreshTokenJwtDecoder;
    private final TokenRepository tokenRepository;

    public JwtTokenUtil(
            @Qualifier("accessTokenJwtEncoder") JwtEncoder accessTokenJwtEncoder,
            @Qualifier("accessTokenJwtDecoder") JwtDecoder accessTokenJwtDecoder,
            @Qualifier("refreshTokenJwtEncoder") JwtEncoder refreshTokenJwtEncoder,
//            @Qualifier("refreshTokenJwtDecoder") JwtDecoder refreshTokenJwtDecoder,
            TokenRepository tokenRepository) {
        this.accessTokenJwtEncoder = accessTokenJwtEncoder;
        this.accessTokenJwtDecoder = accessTokenJwtDecoder;
        this.refreshTokenJwtEncoder = refreshTokenJwtEncoder;
//        this.refreshTokenJwtDecoder = refreshTokenJwtDecoder;
        this.tokenRepository = tokenRepository;
    }

    public String createAccessToken(User user) throws Exception {

        Instant now = Instant.now();
        Instant validity = now.plus(expirationAccessToken, ChronoUnit.SECONDS);
        try {
            JwtClaimsSet claims = JwtClaimsSet.builder()
                    .issuedAt(Instant.now())
                    .expiresAt(validity)
                    .subject(user.getUsername())
                    .claim("username", user.getUsername())
                    .claim("userId", user.getId())
                    .claim("role", user.getRole().getName())
                    .build();
            JwsHeader jwsHeader = JwsHeader.with(JWT_ALGORITHM).build();
            return accessTokenJwtEncoder
                    .encode(JwtEncoderParameters.from(jwsHeader, claims))
                    .getTokenValue();
        } catch (Exception e) {
            throw new Exception("Cannot create jwt token, error :" + e.getMessage());
        }
    }

    public String createRefreshToken(User user) throws Exception {

        Instant now = Instant.now();
        Instant validity = now.plus(expirationRefreshToken, ChronoUnit.SECONDS);
        try {
            JwtClaimsSet claims = JwtClaimsSet.builder()
                    .issuedAt(Instant.now())
                    .expiresAt(validity)
                    .subject(user.getUsername())
                    .claim("userId", user.getId())
                    .build();

            JwsHeader jwsHeader = JwsHeader.with(JWT_ALGORITHM).build();
            return refreshTokenJwtEncoder
                    .encode(JwtEncoderParameters.from(jwsHeader, claims))
                    .getTokenValue();
        } catch (Exception e) {
            throw new Exception("Cannot create refresh token, error :" + e.getMessage());
        }
    }

    public Jwt checkValidRefreshToken(String token) {
        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withSecretKey(getRefreshTokenSecretKey())
                .macAlgorithm(JWT_ALGORITHM)
                .build();
        try {
            return jwtDecoder.decode(token);
        } catch (Exception e) {
            System.out.println(">>> Refresh Token error: " + e.getMessage());
            throw e;
        }
    }

    public boolean isAccessTokenExpired(String token) {
        try {
            // Decode the JWT token to extract the claims
            Jwt jwt = accessTokenJwtDecoder.decode(token);

            // Get the expiration time from the token
            Instant expiration = jwt.getExpiresAt();

            // Check if the token is expired
            assert expiration != null;
            return expiration.isBefore(Instant.now());
        } catch (Exception e) {
            // If an exception occurs (e.g., token is invalid), consider the token as expired
            return true;
        }
    }

    private SecretKey getRefreshTokenSecretKey() {
        byte[] keyBytes = Base64.from(secretKeyRefreshToken).decode();
        return new SecretKeySpec(keyBytes, 0, keyBytes.length, JWT_ALGORITHM.getName());
    }

    public boolean verifyToken(String token) {
        try {
            accessTokenJwtDecoder.decode(token);
        } catch (MalformedJwtException e) {
            throw new MalformedJwtException("Invalid JWT token");
        } catch (ExpiredJwtException e) {
            throw new ExpiredJwtException(null, null, "Expired JWT token", null);
        } catch (UnsupportedJwtException e) {
            throw new UnsupportedJwtException("JWT token is unsupported");
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid JWT token");
        } catch (JwtException e) {
            throw new JwtException("Invalid JWT token");
        }
        return true;
    }

}
