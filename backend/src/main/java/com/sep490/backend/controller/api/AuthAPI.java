package com.sep490.backend.controller.api;

import com.sep490.backend.common.response.ApiResponse;
import com.sep490.backend.dto.authen.*;
import com.sep490.backend.dto.user.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/auth")
@Tag(name = "Auth APIs", description = "Authentication and user profile APIs")
public interface AuthAPI {

    @Operation(summary = "Đăng nhập", description = "Xác thực tài khoản và trả về Access Token + Refresh Token")
    @PostMapping("/login")
    ResponseEntity<ApiResponse<LoginResponseDTO>> login(
            @Valid @RequestBody LoginRequestDTO request);

    @Operation(
            summary = "Đăng xuất",
            description = "Đưa access token hiện tại vào blacklist Redis",
            security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @PostMapping("/logout")
    ResponseEntity<ApiResponse<Void>> logout(HttpServletRequest request);

    @Operation(summary = "Đăng ký", description = "Đăng ký tài khoản người dùng mới và gửi mã OTP")
    @PostMapping("/register")
    ResponseEntity<ApiResponse<RegisterResponseDTO>> register(
            @Valid @RequestBody RegisterRequestDTO request);

    @Operation(summary = "Gửi OTP quên mật khẩu", description = "Gửi mã OTP 6 số đến email để khôi phục mật khẩu")
    @PostMapping("/forgot-password/send-otp")
    ResponseEntity<ApiResponse<Void>> sendForgotPasswordOtp(
            @RequestParam("email") String email);

    @Operation(summary = "Xác thực OTP và đặt lại mật khẩu mới", description = "Kiểm tra OTP và cập nhật mật khẩu mới")
    @PostMapping("/forgot-password")
    ResponseEntity<ApiResponse<ForgotPasswordResponseDTO>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequestDTO request);

    @Operation(
            summary = "Gửi OTP đổi mật khẩu",
            description = "Gửi mã OTP 6 số đến email để đổi mật khẩu (yêu cầu đăng nhập)",
            security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @PostMapping("/reset-password/send-otp")
    ResponseEntity<ApiResponse<Void>> sendResetPasswordOtp(
            @RequestParam(value = "email", required = false) String email);

    @Operation(
            summary = "Đổi mật khẩu",
            description = "Đổi mật khẩu bằng mật khẩu cũ, mật khẩu mới và OTP",
            security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @PostMapping("/reset-password")
    ResponseEntity<ApiResponse<ResetPasswordResponseDTO>> resetPassword(
            @Valid @RequestBody ResetPasswordRequestDTO request);

    @Operation(
            summary = "Lấy thông tin cá nhân",
            description = "Lấy profile của tài khoản đang đăng nhập",
            security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @GetMapping("/profile")
    ResponseEntity<ApiResponse<ProfileDTO>> getProfile();

    @Operation(
            summary = "Cập nhật thông tin cá nhân",
            description = "Cập nhật thông tin tài khoản đang đăng nhập",
            security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @PutMapping("/profile")
    ResponseEntity<ApiResponse<Void>> updateProfile(
            @Valid @RequestBody ProfileDTO request);

    @Operation(summary = "Xác thực OTP kích hoạt tài khoản", description = "Kích hoạt tài khoản đăng ký mới bằng mã OTP")
    @PostMapping("/verify-register-otp")
    ResponseEntity<ApiResponse<Void>> verifyRegisterOtp(
            @Valid @RequestBody VerifyOTPRequestDTO request);
}
