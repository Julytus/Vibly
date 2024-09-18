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

    PasswordEncoder passwordEncoder;

    @NonFinal
    static final String ADMIN_NAME = "admin";

    @NonFinal
    static final String ADMIN_PASSWORD = "admin";

    @NonFinal
    static final String USER_NAME = "user";

    @NonFinal
    static final String USER_PASSWORD = "user";

    @Bean
    @ConditionalOnProperty(
            prefix = "spring",
            value = "datasource.driverClassName",
            havingValue = "com.mysql.cj.jdbc.Driver")
    ApplicationRunner applicationRunner(UserRepository userRepository, RoleRepository roleRepository) {
        log.info("Initializing application.....");
        return args -> {
            Role userRole = roleRepository.save(
                    Role.builder().name(PredefinedRole.USER_ROLE).id(1L).build());

            Role adminRole = roleRepository.save(
                    Role.builder().name(PredefinedRole.ADMIN_ROLE).id(2L).build());
            if (userRepository.count() == 0) {
                // Tạo user admin
                User admin = User.builder()
                        .username(ADMIN_NAME)
                        .password(passwordEncoder.encode(ADMIN_PASSWORD))
                        .role(adminRole)
                        .active(true)
                        .build();
                userRepository.save(admin);

                // Tạo user thường
                User user = User.builder()
                        .username(USER_NAME)
                        .password(passwordEncoder.encode(USER_PASSWORD))
                        .role(userRole)
                        .active(true)
                        .build();
                userRepository.save(user);
                log.warn(
                        "JulyTus: admin and user accounts have been created with default passwords, please change them");
            }
            log.info("JulyTus: Application initialization completed");
        };
    }
}
