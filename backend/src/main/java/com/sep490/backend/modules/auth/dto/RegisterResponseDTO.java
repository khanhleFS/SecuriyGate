package com.sep490.backend.modules.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.UUID;

public record RegisterResponseDTO(
        UUID userId,
        String email,
        String message,
        @Schema(example = "true")
        boolean requiresOtpVerification
) {}
