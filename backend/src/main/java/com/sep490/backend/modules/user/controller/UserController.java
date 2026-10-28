package com.sep490.backend.modules.user.controller;


import com.sep490.backend.common.response.ApiResponse;
import com.sep490.backend.common.util.SecurityUtils;

import com.sep490.backend.modules.user.dto.*;
import com.sep490.backend.modules.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin("*")
@Tag(name = "User APIs", description = "User profile APIs")
public class UserController {

    private final UserService userService;

    @Operation(summary = "Gửi OTP quên mật khẩu",
        description = "Gửi mã OTP 6 số đến email để khôi phục mật khẩu")
    @PostMapping("/forgot-password/send-otp")
    public ResponseEntity<ApiResponse<Void>> sendForgotPasswordOtp(String email) {
        userService.sendForgotPasswordOtp(email);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
            .code(200)
            .message("Mã OTP đã được gửi đến email của bạn.")
            .build());
    }

    @Operation(summary = "Xác thực OTP và đặt lại mật khẩu mới",
        description = "Kiểm tra OTP và cập nhật mật khẩu mới")
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<ForgotPasswordResponseDTO>> forgotPassword(@Valid @RequestBody ForgotPasswordRequestDTO requestDTO) {
        ForgotPasswordResponseDTO result = userService.forgotPassword(requestDTO);
        return ResponseEntity.ok(ApiResponse.<ForgotPasswordResponseDTO>builder()
            .code(200)
            .message("Đặt lại mật khẩu thành công")
            .result(result)
            .build());
    }

    @Operation(
        summary = "Gửi OTP đổi mật khẩu",
        description = "Gửi mã OTP 6 số đến email để đổi mật khẩu (yêu cầu đăng nhập)",
        security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @PostMapping("/reset-password/send-otp")
    public ResponseEntity<ApiResponse<Void>> sendResetPasswordOtp(String email) {
        String targetEmail = (email != null && !email.isBlank())
            ? email
            : SecurityUtils.getCurrentUser().getEmail();
        userService.sendResetPasswordOtp(targetEmail);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
            .code(200)
            .message("Mã OTP đổi mật khẩu đã được gửi đến email của bạn.")
            .build());
    }

    @Operation(
        summary = "Đổi mật khẩu",
        description = "Đổi mật khẩu bằng mật khẩu cũ, mật khẩu mới và OTP",
        security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<ResetPasswordResponseDTO>> resetPassword(@Valid @RequestBody ResetPasswordRequestDTO requestDTO) {
        ResetPasswordResponseDTO result = userService.resetPassword(requestDTO);
        return ResponseEntity.ok(ApiResponse.<ResetPasswordResponseDTO>builder()
            .code(200)
            .message("Cập nhật mật khẩu thành công")
            .result(result)
            .build());
    }

    @Operation(
        summary = "Lấy thông tin cá nhân",
        description = "Lấy profile của tài khoản đang đăng nhập",
        security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<ProfileDTO>> getProfile() {
        ProfileDTO profile = userService.getProfile(SecurityUtils.getCurrentUser().getId());
        return ResponseEntity.ok(ApiResponse.<ProfileDTO>builder()
            .code(200)
            .message("Lấy thông tin cá nhân thành công")
            .result(profile)
            .build());
    }

    @Operation(
        summary = "Cập nhật thông tin cá nhân",
        description = "Cập nhật thông tin tài khoản",
        security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @PatchMapping("/profile")
    public ResponseEntity<ApiResponse<Void>> updateProfile(@Valid @RequestBody ProfileDTO profileDTO) {
        userService.updateProfile(SecurityUtils.getCurrentUser().getId(), profileDTO);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
            .code(200)
            .message("Cập nhật thông tin cá nhân thành công")
            .build());
    }
}
