package com.sep490.backend.modules.user.service;

import com.sep490.backend.modules.user.dto.*;

import java.util.UUID;

public interface UserService {
    void sendForgotPasswordOtp(String email);
    ForgotPasswordResponseDTO forgotPassword(ForgotPasswordRequestDTO request);
    void sendResetPasswordOtp(String email);
    ResetPasswordResponseDTO resetPassword(ResetPasswordRequestDTO request);
    ProfileDTO getProfile(UUID id);
    void updateProfile(UUID id, ProfileDTO profile);
}
