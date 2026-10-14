package com.sep490.backend.dto.authen;

import io.swagger.v3.oas.annotations.media.Schema;

public record ForgotPasswordResponseDTO(
        @Schema(example = "user@example.com")
        String email,
        @Schema(example = "Mật khẩu mới đã được cập nhật thành công.")
        String message,
        @Schema(example = "true")
        boolean success
) {}
