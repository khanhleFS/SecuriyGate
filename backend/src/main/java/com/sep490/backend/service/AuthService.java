package com.sep490.backend.service;

import com.sep490.backend.dto.authen.*;
import com.sep490.backend.dto.user.*;

import java.util.UUID;

public interface AuthService {
    LoginResponseDTO login(LoginRequestDTO request);
    void logout(String authHeader);
    RegisterResponseDTO register(RegisterRequestDTO request);
    void sendForgotPasswordOtp(String email);
    ForgotPasswordResponseDTO forgotPassword(ForgotPasswordRequestDTO request);
    void sendResetPasswordOtp(String email);
    ResetPasswordResponseDTO resetPassword(ResetPasswordRequestDTO request);
    ProfileDTO getProfile(UUID id);
    void updateProfile(UUID id, ProfileDTO profile);
    boolean verifyRegisterOtp(String email, String otpCode);
}
