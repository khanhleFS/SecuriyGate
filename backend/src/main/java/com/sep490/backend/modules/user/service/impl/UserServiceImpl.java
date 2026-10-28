package com.sep490.backend.modules.user.service.impl;

import com.sep490.backend.common.exception.ApiException;
import com.sep490.backend.common.exception.errorCode.UserErrorCode;
import com.sep490.backend.common.mail.OtpEmailType;
import com.sep490.backend.common.mail.OtpMailHelper;
import com.sep490.backend.modules.auth.entity.OTP;
import com.sep490.backend.modules.auth.repository.OTPRepository;
import com.sep490.backend.modules.user.dto.*;
import com.sep490.backend.modules.user.entity.User;
import com.sep490.backend.modules.user.repository.UserRepository;
import com.sep490.backend.modules.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpMailHelper otpMailHelper;
    private final OTPRepository otpRepository;

    @Override
    @Transactional
    public void sendForgotPasswordOtp(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ApiException(UserErrorCode.EMAIL_NOT_FOUND));

        String otpCode = String.format("%06d", new SecureRandom().nextInt(999999));
        otpRepository.deleteByEmail(email);
        OTP otp = OTP.builder()
            .email(email)
            .otpCode(otpCode)
            .expiryTime(Instant.now().plusSeconds(5 * 60))
            .build();
        otpRepository.save(otp);

        try {
            String recipientName = user.getFullName() != null ? user.getFullName() : user.getUsername();
            otpMailHelper.sendOtpMail(email, recipientName, otpCode, OtpEmailType.FORGOT_PASSWORD);
        } catch (Exception e) {
            log.error("Lỗi gửi email quên mật khẩu: {}", e.getMessage());
            throw new ApiException(UserErrorCode.SEND_EMAIL_FAILED, "Lỗi gửi email: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public ForgotPasswordResponseDTO forgotPassword(ForgotPasswordRequestDTO request) {
        if (!request.newPassword().equals(request.confirmPassword())) {
            throw new ApiException(UserErrorCode.PASSWORD_CONFIRMATION_MISMATCH);
        }

        OTP otp = otpRepository.findByEmailAndOtpCode(request.email(), request.otpCode())
            .orElseThrow(() -> new ApiException(UserErrorCode.FORGOT_PASSWORD_OTP_INVALID));

        if (otp.getExpiryTime().isBefore(Instant.now())) {
            throw new ApiException(UserErrorCode.FORGOT_PASSWORD_OTP_EXPIRED);
        }

        User user = userRepository.findByEmail(request.email())
            .orElseThrow(() -> new ApiException(UserErrorCode.USER_NOT_FOUND));

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
        otpRepository.deleteByEmail(request.email());

        return new ForgotPasswordResponseDTO(request.email(), "Mật khẩu đã được đặt lại thành công.", true);
    }

    @Override
    @Transactional
    public void sendResetPasswordOtp(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ApiException(UserErrorCode.USER_NOT_FOUND));

        String otpCode = String.format("%06d", new SecureRandom().nextInt(999999));
        otpRepository.deleteByEmail(email);
        OTP otp = OTP.builder()
            .email(email)
            .otpCode(otpCode)
            .expiryTime(Instant.now().plusSeconds(5 * 60))
            .build();
        otpRepository.save(otp);

        try {
            String recipientName = user.getFullName() != null ? user.getFullName() : user.getUsername();
            otpMailHelper.sendOtpMail(email, recipientName, otpCode, OtpEmailType.RESET_PASSWORD);
        } catch (Exception e) {
            log.error("Lỗi gửi email đổi mật khẩu: {}", e.getMessage());
            throw new ApiException(UserErrorCode.SEND_EMAIL_FAILED, "Lỗi gửi email: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public ResetPasswordResponseDTO resetPassword(ResetPasswordRequestDTO request) {
        if (!request.newPassword().equals(request.confirmPassword())) {
            throw new ApiException(UserErrorCode.PASSWORD_CONFIRMATION_MISMATCH);
        }

        OTP otp = otpRepository.findByEmailAndOtpCode(request.email(), request.otpCode())
            .orElseThrow(() -> new ApiException(UserErrorCode.RESET_PASSWORD_OTP_INVALID));

        if (otp.getExpiryTime().isBefore(Instant.now())) {
            throw new ApiException(UserErrorCode.RESET_PASSWORD_OTP_EXPIRED);
        }

        User user = userRepository.findByEmail(request.email())
            .orElseThrow(() -> new ApiException(UserErrorCode.USER_NOT_FOUND));

        if (!passwordEncoder.matches(request.oldPassword(), user.getPassword())) {
            throw new ApiException(UserErrorCode.OLD_PASSWORD_INCORRECT);
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
        otpRepository.deleteByEmail(request.email());

        return new ResetPasswordResponseDTO(request.email(), "Mật khẩu đã được cập nhật thành công.", user.getId(), "/login");
    }

    @Override
    public ProfileDTO getProfile(UUID id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ApiException(UserErrorCode.USER_NOT_FOUND));

        return ProfileDTO.builder()
            .id(user.getId())
            .role(user.getRole())
            .username(user.getUsername())
            .fullName(user.getFullName())
            .email(user.getEmail())
            .phone(user.getPhone())
            .address(user.getAddress())
            .build();
    }

    @Override
    @Transactional
    public void updateProfile(UUID id, ProfileDTO profile) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ApiException(UserErrorCode.USER_NOT_FOUND));

        // Cập nhật họ tên nếu có truyền lên
        if (profile.fullName() != null && !profile.fullName().isBlank()) {
            user.setFullName(profile.fullName().trim());
        }

        // Cập nhật username nếu có truyền lên và kiểm tra trùng lặp
        if (profile.username() != null && !profile.username().isBlank()) {
            String newUsername = profile.username().trim();
            if (!newUsername.equalsIgnoreCase(user.getUsername())) {
                if (userRepository.existsByUsername(newUsername)) {
                    throw new ApiException(UserErrorCode.USERNAME_ALREADY_EXISTS);
                }
                user.setUsername(newUsername);
            }
        }

        // Cập nhật email nếu có truyền lên và kiểm tra trùng lặp
        if (profile.email() != null && !profile.email().isBlank()) {
            String newEmail = profile.email().trim();
            if (!newEmail.equalsIgnoreCase(user.getEmail())) {
                if (userRepository.existsByEmail(newEmail)) {
                    throw new ApiException(UserErrorCode.EMAIL_ALREADY_EXISTS);
                }
                user.setEmail(newEmail);
            }
        }

        // Cập nhật số điện thoại nếu có truyền lên và kiểm tra trùng lặp
        if (profile.phone() != null && !profile.phone().isBlank()) {
            String newPhone = profile.phone().trim();
            if (!newPhone.equals(user.getPhone())) {
                userRepository.findByPhone(newPhone).ifPresent(existingUser -> {
                    if (!existingUser.getId().equals(id)) {
                        throw new ApiException(UserErrorCode.PHONE_ALREADY_EXISTS);
                    }
                });
                user.setPhone(newPhone);
            }
        }

        // Cập nhật địa chỉ nếu có truyền lên
        if (profile.address() != null) {
            user.setAddress(profile.address().trim());
        }

        userRepository.save(user);
    }
}
