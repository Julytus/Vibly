package com.julytus.IdentityService.configurations;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import com.nimbusds.jose.util.Base64;

@Configuration
public class SecurityJwtConfig {
    @Value("${jwt.secret-key-access-token}")
    private String secretKeyAccessToken;

    @Value("${jwt.secret-key-refresh-token}")
    private String secretKeyRefreshToken;

    public static final MacAlgorithm JWT_ALGORITHM = MacAlgorithm.HS256;

    private final Logger log = LoggerFactory.getLogger(SecurityJwtConfig.class);

    private SecretKey getAccessTokenSecretKey() {
        byte[] keyBytes = Base64.from(secretKeyAccessToken).decode();
        return new SecretKeySpec(keyBytes, 0, keyBytes.length, JWT_ALGORITHM.getName());
    }

    private SecretKey getRefreshTokenSecretKey() {
        byte[] keyBytes = Base64.from(secretKeyRefreshToken).decode();
        return new SecretKeySpec(keyBytes, 0, keyBytes.length, JWT_ALGORITHM.getName());
    }

    @Bean
    @Primary
    public JwtDecoder accessTokenJwtDecoder() {
        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withSecretKey(getAccessTokenSecretKey())
                .macAlgorithm(JWT_ALGORITHM)
                .build();
        return getJwtDecoder(jwtDecoder);
    }

    @Bean
    @Primary
    public JwtEncoder accessTokenJwtEncoder() {
        return new NimbusJwtEncoder(new ImmutableSecret<>(getAccessTokenSecretKey()));
    }

    @Bean
    public JwtDecoder refreshTokenJwtDecoder() {
        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withSecretKey(getRefreshTokenSecretKey())
                .macAlgorithm(JWT_ALGORITHM)
                .build();
        return getJwtDecoder(jwtDecoder);
    }

    @Bean
    public JwtEncoder refreshTokenJwtEncoder() {
        return new NimbusJwtEncoder(new ImmutableSecret<>(getRefreshTokenSecretKey()));
    }

    private JwtDecoder getJwtDecoder(NimbusJwtDecoder jwtDecoder) {
        return token -> {
            try {
                return jwtDecoder.decode(token);
            } catch (Exception e) {
                if (e.getMessage().contains("Invalid signature")) {
                    log.warn("Token has an invalid signature.");
                } else if (e.getMessage().contains("Jwt expired at")) {
                    log.warn("Token has expired.");
                } else if (e.getMessage().contains("Invalid JWT serialization")
                        || e.getMessage().contains("Malformed token")
                        || e.getMessage().contains("Invalid unsecured/JWS/JWE")) {
                    log.warn("Token is malformed or has an invalid structure.");
                } else {
                    log.error("Unknown JWT error: {}", e.getMessage());
                }
                throw e;
            }
        };
    }
}
