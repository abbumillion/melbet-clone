package com.melbet.backend.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record VerifyRequest(
        @NotBlank String email,
        @NotBlank String code
) {}
