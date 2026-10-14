package com.sep490.backend.dto.authen;

import com.sep490.backend.entity.Enumeration.UserRole;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import java.util.UUID;

@Builder
public record ProfileDTO(
        UUID id,
        @NotBlank(message = "Họ tên không được để trống.")
        @Schema(example = "Nguyen Van A")
        String fullName,

        @NotBlank(message = "Email không được để trống.")
        @Email(message = "Email không đúng định dạng.")
        @Schema(example = "user@example.com")
        String email,

        @NotBlank(message = "Số điện thoại không được để trống.")
        @Schema(example = "0912345678")
        String phone,

        @Schema(example = "123 Nguyen Trai, District 1, Ho Chi Minh City")
        String address,

        UserRole role
) {}
