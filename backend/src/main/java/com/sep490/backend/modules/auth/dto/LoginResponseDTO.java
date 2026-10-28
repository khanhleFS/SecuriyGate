package com.sep490.backend.modules.auth.dto;

import com.sep490.backend.modules.user.entity.UserRole;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.UUID;

public record LoginResponseDTO(
        @Schema(example = "eyJhbGciOiJIUzI1NiJ9...")
        String accessToken,
        @Schema(example = "uuid-refresh-token")
        String refreshToken,
        @Schema(example = "550e8400-e29b-41d4-a716-446655440000")
        UUID userId,
        @Schema(example = "Nguyen Van A")
        String fullName,
        @Schema(example = "nguyenvana")
        String username,
        @Schema(example = "user@example.com")
        String email,
        @Schema(example = "USER")
        UserRole role
) {}
