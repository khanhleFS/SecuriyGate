package com.sep490.backend.modules.user.dto;

import com.sep490.backend.modules.user.entity.UserRole;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import java.util.UUID;

@Builder
public record ProfileDTO(

        UUID id,

        @Size(min = 2, max = 50, message = "Họ tên phải từ 2 đến 50 ký tự.")
        @Schema(example = "Nguyen Van A")
        String fullName,

        @Size(min = 5, max = 50, message = "Tên người dùng phải từ 5 đến 50 ký tự.")
        @Pattern(regexp = "^[\\p{L}0-9_]+$",
            message = "Tên người dùng chỉ được chứa chữ cái, số và dấu gạch dưới.")
        @Schema(example = "nguyenvana")
        String username,

        @Email(message = "Email không đúng định dạng.")
        @Schema(example = "user@example.com")
        String email,

        @Pattern(regexp = "^0[3|5|7|8|9][0-9]{8}$", message = "Số điện thoại không đúng định dạng.")
        @Schema(example = "0912345678")
        String phone,

        @Size(max = 200, message = "Địa chỉ không được vượt quá 200 ký tự.")
        @Schema(example = "123 Nguyen Trai, District 1, Ho Chi Minh City")
        String address,

        UserRole role
) {}
