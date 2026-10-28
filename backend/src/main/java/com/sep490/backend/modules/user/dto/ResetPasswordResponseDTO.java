package com.sep490.backend.modules.user.dto;

import java.util.UUID;

public record ResetPasswordResponseDTO(
        String email,
        String message,
        UUID userId,
        String redirectUrl
) {}
