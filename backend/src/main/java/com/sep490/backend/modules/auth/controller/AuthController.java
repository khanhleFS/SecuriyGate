package com.sep490.backend.modules.auth.controller;

import com.sep490.backend.common.response.ApiResponse;
import com.sep490.backend.modules.auth.dto.*;
import com.sep490.backend.modules.auth.service.AuthService;
import com.sep490.backend.modules.user.dto.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin("*")
@Tag(name = "Auth APIs", description = "Authentication and user profile APIs")
public class AuthController{

    private final AuthService authService;

    @Operation(summary = "Đăng nhập", description = "Xác thực tài khoản và trả về Access Token + Refresh Token")
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponseDTO>> login(@Valid @RequestBody LoginRequestDTO loginRequestDTO) {
        LoginResponseDTO loginResponse = authService.login(loginRequestDTO);
        return ResponseEntity.ok(ApiResponse.<LoginResponseDTO>builder()
                .code(200)
                .message("Đăng nhập thành công")
                .result(loginResponse)
                .build());
    }

    @Operation(
        summary = "Đăng xuất",
        description = "Đưa access token hiện tại vào blacklist Redis",
        security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        authService.logout(authHeader);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .code(200)
                .message("Đăng xuất thành công")
                .build());
    }

    @Operation(summary = "Đăng ký",
        description = "Đăng ký tài khoản người dùng mới và gửi mã OTP")
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<RegisterResponseDTO>> register(@Valid @RequestBody RegisterRequestDTO registerRequestDTO) {
        RegisterResponseDTO responseDTO = authService.register(registerRequestDTO);
        return ResponseEntity.ok(ApiResponse.<RegisterResponseDTO>builder()
                .code(200)
                .message("Đăng ký thành công. Vui lòng kiểm tra email để kích hoạt tài khoản.")
                .result(responseDTO)
                .build());
    }

    @Operation(summary = "Xác thực OTP kích hoạt tài khoản",
        description = "Kích hoạt tài khoản đăng ký mới bằng mã OTP")
    @PostMapping("/verify-register-otp")
    public ResponseEntity<ApiResponse<Void>> verifyRegisterOtp(@Valid @RequestBody VerifyOTPRequestDTO requestDTO) {
        authService.verifyRegisterOtp(requestDTO.email(), requestDTO.otpCode());
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .code(200)
                .message("Xác thực thành công. Tài khoản đã được kích hoạt.")
                .build());
    }

    @Operation(summary = "Gửi lại OTP kích hoạt tài khoản",
        description = "Gửi lại mã OTP qua email khi mã cũ đã hết hạn hoặc chưa nhận được")
    @PostMapping("/resend-register-otp")
    public ResponseEntity<ApiResponse<Void>> resendRegisterOtp(@RequestParam("email") String email) {
        authService.resendRegisterOtp(email);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .code(200)
                .message("Mã OTP kích hoạt mới đã được gửi đến email của bạn.")
                .build());
    }
}
