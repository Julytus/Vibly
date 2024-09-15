package com.julytus.IdentityService.repositories;

import java.util.Optional;

import com.julytus.IdentityService.models.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    long count();

    boolean existsByUsername(String username);

    Optional<User> findByUsername(String username);

}
