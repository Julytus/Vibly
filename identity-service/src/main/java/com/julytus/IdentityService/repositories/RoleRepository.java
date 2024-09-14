package com.julytus.IdentityService.repositories;

import com.julytus.IdentityService.models.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    long count();

    Role getRoleByName(String name);
}
