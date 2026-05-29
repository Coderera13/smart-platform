package com.smartproject.backend.serviceimpl;

import com.smartproject.backend.dto.AuthResponse;
import com.smartproject.backend.dto.LoginRequest;
import com.smartproject.backend.dto.RegisterRequest;
import com.smartproject.backend.entity.Role;
import com.smartproject.backend.entity.User;
import com.smartproject.backend.repository.RoleRepository;
import com.smartproject.backend.repository.UserRepository;
import com.smartproject.backend.security.JwtService;
import com.smartproject.backend.service.AuthService;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashSet;
import java.util.Set;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    public AuthServiceImpl(UserRepository userRepository,
                           RoleRepository roleRepository,
                           PasswordEncoder passwordEncoder,
                           JwtService jwtService,
                           AuthenticationManager authenticationManager,
                           UserDetailsService userDetailsService) {

        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
    }

    @Override
    public AuthResponse register(RegisterRequest request) {

        // Check duplicate email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email already exists"
            );
        }

        // Find or create student role
        Role studentRole = roleRepository.findByName("ROLE_STUDENT")
                .orElseGet(() ->
                        roleRepository.save(
                                Role.builder()
                                        .name("ROLE_STUDENT")
                                        .build()
                        )
                );

        Set<Role> roles = new HashSet<>();
        roles.add(studentRole);

        // Create user
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .roles(roles)
                .enabled(true)
                .build();

        // Save user
        userRepository.save(user);

        // Generate JWT token
        UserDetails userDetails =
                userDetailsService.loadUserByUsername(user.getEmail());

        String token = jwtService.generateToken(userDetails);

        return new AuthResponse(
                "User registered successfully",
                token
        );
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        // Authenticate email and password
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // Load user
        UserDetails userDetails =
                userDetailsService.loadUserByUsername(request.getEmail());

        // Generate JWT token
        String token = jwtService.generateToken(userDetails);

        return new AuthResponse(
                "Login successful",
                token
        );
    }
}