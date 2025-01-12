package com.julytus.IdentityService.services;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.julytus.IdentityService.exceptions.DataNotFoundException;
import com.julytus.IdentityService.exceptions.ExpiredTokenException;
import com.julytus.IdentityService.exceptions.IdInvalidException;
import com.julytus.IdentityService.models.entity.Token;
import com.julytus.IdentityService.models.entity.User;
import com.julytus.IdentityService.repositories.TokenRepository;
import com.julytus.IdentityService.utils.JwtTokenUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TokenService {
    private static final int MAX_TOKENS = 3;

    @Value("${jwt.expiration-access-token}")
    private int expirationAccessToken; // save to an environment variable

    @Value("${jwt.expiration-refresh-token}")
    private int expirationRefreshToken;

    private final TokenRepository tokenRepository;
    private final JwtTokenUtil jwtTokenUtil;

    @Transactional
    public Token addToken(User user, String token) throws Exception {
        List<Token> userTokens = tokenRepository.findByUser(user);
        int tokenCount = userTokens.size();

        if (tokenCount >= MAX_TOKENS) {
            tokenRepository.delete(userTokens.getFirst());
        }
        String newRefreshToke = jwtTokenUtil.createRefreshToken(user);
        // Generate a new token for the user
        Token newToken = Token.builder()
                .user(user)
                .token(token)
                .revoked(false)
                .expired(false)
                .tokenType("Bearer")
                .expirationDate(LocalDateTime.now().plusSeconds(expirationAccessToken))
                .refreshToken(newRefreshToke)
                .refreshExpirationDate(LocalDateTime.now().plusSeconds(expirationRefreshToken))
                .build();
        return tokenRepository.save(newToken);
    }

    @Transactional
    public Token refreshToken(String refreshToken, User user) throws Exception {
        if (refreshToken.equals("Hi!") || refreshToken.isEmpty()) {
            throw new IdInvalidException("You do not have a refresh token in your cookie.");
        }

        String newAccessToken = jwtTokenUtil.createAccessToken(user);
        String newRefreshToken = jwtTokenUtil.createRefreshToken(user);

        return Token
                .builder()
                .refreshToken(newRefreshToken)
                .token(newAccessToken)
                .build();
    }

    @Transactional
    public void revokeUserToken(User user, String tokenToRevoke) throws DataNotFoundException {
        Token token = tokenRepository.findByTokenAndUser(tokenToRevoke, user)
                .orElseThrow(() -> new DataNotFoundException("Token not found"));

        token.setRevoked(true);
        token.setExpired(true);

        tokenRepository.save(token);
    }
}