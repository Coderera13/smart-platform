package com.smartproject.backend.util;

import com.smartproject.backend.entity.Role;
import com.smartproject.backend.entity.User;
import com.smartproject.backend.repository.RoleRepository;
import com.smartproject.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RoleRepository roleRepository,
                           UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        Role studentRole = roleRepository.findByName("ROLE_STUDENT")
                .orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_STUDENT").build()));

        Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                .orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_ADMIN").build()));

        if (userRepository.findByEmail("admin@smartinterview.com").isEmpty()) {
            Set<Role> roles = new HashSet<>();
            roles.add(adminRole);

            User admin = User.builder()
                    .name("Admin")
                    .email("admin@smartinterview.com")
                    .password(passwordEncoder.encode("admin123"))
                    .phone("9999999999")
                    .roles(roles)
                    .enabled(true)
                    .build();

            userRepository.save(admin);
        }
    }
}