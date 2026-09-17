package com.melbet.backend.auth.dto;

public record AuthResponse(
        String token,
        String email,
        String role,
        boolean emailVerified,
        String message
) {}
