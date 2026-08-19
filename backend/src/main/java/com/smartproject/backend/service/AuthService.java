package com.smartproject.backend.service;

import com.smartproject.backend.dto.AuthResponse;
import com.smartproject.backend.dto.ForgotPasswordRequest;
import com.smartproject.backend.dto.LoginRequest;
import com.smartproject.backend.dto.RegisterRequest;
import com.smartproject.backend.dto.ResetPasswordRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    String forgotPassword(ForgotPasswordRequest request);

    String resetPassword(ResetPasswordRequest request);
}