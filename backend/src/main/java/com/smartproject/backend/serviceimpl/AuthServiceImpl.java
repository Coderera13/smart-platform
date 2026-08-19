package com.smartproject.backend.serviceimpl;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.smartproject.backend.dto.AuthResponse;
import com.smartproject.backend.dto.ForgotPasswordRequest;
import com.smartproject.backend.dto.LoginRequest;
import com.smartproject.backend.dto.RegisterRequest;
import com.smartproject.backend.dto.ResetPasswordRequest;
import com.smartproject.backend.entity.PasswordResetToken;
import com.smartproject.backend.entity.Role;
import com.smartproject.backend.entity.User;
import com.smartproject.backend.repository.PasswordResetTokenRepository;
import com.smartproject.backend.repository.RoleRepository;
import com.smartproject.backend.repository.UserRepository;
import com.smartproject.backend.security.JwtService;
import com.smartproject.backend.service.AuthService;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    public AuthServiceImpl(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager,
            UserDetailsService userDetailsService,
            PasswordResetTokenRepository passwordResetTokenRepository
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
    }

    @Override
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email already exists"
            );
        }

        Role studentRole = roleRepository
                .findByName("ROLE_STUDENT")
                .orElseGet(() ->
                        roleRepository.save(
                                Role.builder()
                                        .name("ROLE_STUDENT")
                                        .build()
                        )
                );

        Set<Role> roles = new HashSet<>();
        roles.add(studentRole);

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .gender(request.getGender())
                .branch(request.getBranch())
                .section(request.getSection())
                .rollNo(request.getRollNo())
                .roles(roles)
                .enabled(true)
                .build();

        userRepository.save(user);

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

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        UserDetails userDetails =
                userDetailsService.loadUserByUsername(
                        request.getEmail()
                );

        String token = jwtService.generateToken(userDetails);

        return new AuthResponse(
                "Login successful",
                token
        );
    }

    @Override
    public String forgotPassword(ForgotPasswordRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "No account found with this email"
                        )
                );

        // Delete any previous reset token
        passwordResetTokenRepository.deleteByUserId(user.getId());

        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken =
                PasswordResetToken.builder()
                        .token(token)
                        .user(user)
                        .expiresAt(
                                LocalDateTime.now().plusMinutes(15)
                        )
                        .build();

        passwordResetTokenRepository.save(resetToken);

        return token;
    }

    @Override
    public String resetPassword(
            ResetPasswordRequest request
    ) {

        PasswordResetToken resetToken =
                passwordResetTokenRepository
                        .findByToken(request.getToken())
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Invalid reset token"
                                )
                        );

        if (resetToken.getExpiresAt()
                .isBefore(LocalDateTime.now())) {

            passwordResetTokenRepository.delete(resetToken);

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Reset token has expired"
            );
        }

        User user = resetToken.getUser();

        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        userRepository.save(user);

        // Token can only be used once
        passwordResetTokenRepository.delete(resetToken);

        return "Password reset successful";
    }
}