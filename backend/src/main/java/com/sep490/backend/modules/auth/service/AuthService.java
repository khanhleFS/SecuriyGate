package com.sep490.backend.modules.auth.service;

import com.sep490.backend.modules.auth.dto.*;
import com.sep490.backend.modules.user.dto.*;

import java.util.UUID;

public interface AuthService {
    LoginResponseDTO login(LoginRequestDTO request);
    void logout(String authHeader);
    RegisterResponseDTO register(RegisterRequestDTO request);
    boolean verifyRegisterOtp(String email, String otpCode);
    void resendRegisterOtp(String email);
}
