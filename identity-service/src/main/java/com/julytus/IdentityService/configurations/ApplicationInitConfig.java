package com.julytus.IdentityService.configurations;

import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.julytus.IdentityService.constants.PredefinedRole;
import com.julytus.IdentityService.models.entity.Role;
import com.julytus.IdentityService.models.entity.User;
import com.julytus.IdentityService.repositories.RoleRepository;
import com.julytus.IdentityService.repositories.UserRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ApplicationInitConfig {
    @Bean
    @ConditionalOnProperty(
            prefix = "spring",
            value = "datasource.driverClassName",
            havingValue = "com.mysql.cj.jdbc.Driver")
    ApplicationRunner applicationRunner(RoleRepository roleRepository) {
        log.info("Initializing application.....");
        return args -> {
            roleRepository.save(
                    Role.builder().name(PredefinedRole.USER_ROLE).id(1L).build());

            roleRepository.save(
                    Role.builder().name(PredefinedRole.ADMIN_ROLE).id(2L).build());
            log.info("JulyTus: Application initialization completed");
        };
    }
}
