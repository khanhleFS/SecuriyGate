package com.sep490.backend.dto.user;

import java.util.UUID;

public record ResetPasswordResponseDTO(
        String email,
        String message,
        UUID userId,
        String redirectUrl
) {}
