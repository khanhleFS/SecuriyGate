package com.sep490.backend.modules.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResetPasswordRequestDTO(

        @NotBlank(message = "Email không được để trống.")
        @Email(message = "Email không đúng định dạng.")
        @Schema(example = "user@example.com")
        String email,

        @NotBlank(message = "Mật khẩu cũ không được để trống.")
        @Schema(example = "OldP@ssw0rd123")
        String oldPassword,

        @NotBlank(message = "Mật khẩu mới không được để trống.")
        @Size(min = 8, max = 50, message = "Mật khẩu phải từ 8 đến 50 ký tự.")
        @Schema(example = "NewP@ssw0rd123")
        String newPassword,

        @NotBlank(message = "Xác nhận mật khẩu không được để trống.")
        @Schema(example = "NewP@ssw0rd123")
        String confirmPassword,

        @NotBlank(message = "Mã OTP không được để trống.")
        @Size(min = 6, max = 6, message = "Mã OTP phải gồm đúng 6 chữ số.")
        @Schema(example = "123456")
        String otpCode
) {}
