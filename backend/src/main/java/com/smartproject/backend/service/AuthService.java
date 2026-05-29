package com.smartproject.backend.service;

import com.smartproject.backend.dto.AuthResponse;
import com.smartproject.backend.dto.LoginRequest;
import com.smartproject.backend.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}