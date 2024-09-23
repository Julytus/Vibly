package com.julytus.IdentityService.repositories;

import com.julytus.IdentityService.models.entity.Token;
import com.julytus.IdentityService.models.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Long> {
    List<Token> findByUser(User user);

    Token findByToken(String token);

    Optional<Token> findByRefreshToken(String token);

    Optional<Token> findByTokenAndUser(String token, User user);
}
