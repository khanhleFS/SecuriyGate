package com.sep490.backend.service.impl;

import com.sep490.backend.common.security.CustomUserDetail;
import com.sep490.backend.common.security.JwtService;
import com.sep490.backend.common.security.TokenBlacklistService;
import com.sep490.backend.dto.authen.*;
import com.sep490.backend.dto.user.*;
import com.sep490.backend.entity.Enumeration.UserRole;
import com.sep490.backend.entity.OTP;
import com.sep490.backend.entity.RefreshTokenRedis;
import com.sep490.backend.entity.User;
import com.sep490.backend.repository.OTPRepository;
import com.sep490.backend.repository.RefreshTokenRedisRepository;
import com.sep490.backend.repository.UserRepository;
import com.sep490.backend.service.AuthService;
import com.sep490.backend.service.MailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;
    private final OTPRepository otpRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RefreshTokenRedisRepository refreshTokenRepository;
    private final TokenBlacklistService tokenBlacklistService;

    @Override
    @Transactional
    public LoginResponseDTO login(LoginRequestDTO request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.userNameOrEmail(), request.password())
        );

        CustomUserDetail userDetail = (CustomUserDetail) authentication.getPrincipal();
        User user = userDetail.getUser();

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email để xác nhận.");
        }

        String accessToken = jwtService.generateAccessToken(userDetail);
        String refreshToken = jwtService.generateRefreshToken(userDetail);
        long expirationInSeconds = 7 * 24 * 60 * 60; // 7 ngày

        RefreshTokenRedis tokenRedis = RefreshTokenRedis.builder()
                .token(refreshToken)
                .userId(user.getId())
                .email(user.getEmail())
                .ttlInSeconds(expirationInSeconds)
                .build();
        refreshTokenRepository.save(tokenRedis);

        return new LoginResponseDTO(
                accessToken,
                refreshToken,
                user.getId(),
                user.getFullName(),
                user.getUsername(),
                user.getEmail(),
                user.getRole()
        );
    }

    @Override
    @Transactional
    public void logout(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwt = authHeader.substring(7);
            try {
                Date expiration = jwtService.extractExpiration(jwt);
                long remainingTimeMs = expiration.getTime() - System.currentTimeMillis();
                if (remainingTimeMs > 0) {
                    tokenBlacklistService.blacklistToken(jwt, remainingTimeMs);
                }
            } catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token không hợp lệ hoặc đã hết hạn");
            }
        }
    }

    @Override
    @Transactional
    public RegisterResponseDTO register(RegisterRequestDTO request) {
        if (!request.password().equals(request.confirmPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mật khẩu và xác nhận mật khẩu không khớp.");
        }
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email đã tồn tại");
        }
        if (userRepository.findByUsername(request.username()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Tên người dùng đã tồn tại");
        }
        if (request.phone() != null && !request.phone().isBlank() && userRepository.findByPhone(request.phone()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Số điện thoại đã tồn tại");
        }

        User user = User.builder()
                .username(request.username())
                .fullName(request.fullName())
                .email(request.email())
                .phone(request.phone())
                .password(passwordEncoder.encode(request.password()))
                .address(request.address())
                .role(UserRole.USER)
                .isActive(false) // Cần xác thực OTP để kích hoạt
                .build();
        User savedUser = userRepository.save(user);

        // Sinh OTP 6 chữ số
        String otpCode = String.format("%06d", new SecureRandom().nextInt(999999));
        otpRepository.deleteByEmail(request.email());
        OTP otp = OTP.builder()
                .email(request.email())
                .otpCode(otpCode)
                .expiryTime(Instant.now().plusSeconds(5 * 60)) // 5 phút
                .build();
        otpRepository.save(otp);

        try {
            Map<String, Object> variables = new HashMap<>();
            variables.put("fullName", request.fullName());
            variables.put("otpCode", otpCode);
            variables.put("actionTitle", "Xác nhận đăng ký tài khoản");
            variables.put("actionMessage", "Hệ thống vừa nhận được yêu cầu đăng ký tài khoản vào hệ thống Security Gate. Để tiếp tục và bảo vệ an toàn cho tài khoản, vui lòng nhập mã OTP dưới đây để hoàn tất đăng ký:");
            variables.put("expiryMinutes", 5);
            mailService.sendWithTemplate(
                    request.email(),
                    "Xác nhận đăng ký tài khoản - Security Gate",
                    "email/otp-email",
                    variables
            );
        } catch (Exception e) {
            log.error("Không thể gửi email OTP đăng ký: {}", e.getMessage());
        }

        return new RegisterResponseDTO(
                savedUser.getId(),
                savedUser.getEmail(),
                "Đăng ký thành công. Vui lòng kiểm tra email để kích hoạt tài khoản.",
                true
        );
    }

    @Override
    @Transactional
    public boolean verifyRegisterOtp(String email, String otpCode) {
        OTP otp = otpRepository.findByEmailAndOtpCode(email, otpCode)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã OTP không hợp lệ"));

        if (otp.getExpiryTime().isBefore(Instant.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã OTP đã hết hạn");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng"));

        user.setIsActive(true);
        userRepository.save(user);
        otpRepository.deleteByEmail(email);
        return true;
    }

    @Override
    @Transactional
    public void sendForgotPasswordOtp(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Email không tồn tại trong hệ thống"));

        String otpCode = String.format("%06d", new SecureRandom().nextInt(999999));
        otpRepository.deleteByEmail(email);
        OTP otp = OTP.builder()
                .email(email)
                .otpCode(otpCode)
                .expiryTime(Instant.now().plusSeconds(5 * 60))
                .build();
        otpRepository.save(otp);

        try {
            Map<String, Object> variables = new HashMap<>();
            variables.put("fullName", user.getFullName() != null ? user.getFullName() : user.getUsername());
            variables.put("otpCode", otpCode);
            variables.put("actionTitle", "Yêu cầu đặt lại mật khẩu");
            variables.put("actionMessage", "Hệ thống vừa nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Để tiếp tục và bảo vệ an toàn cho tài khoản, vui lòng nhập mã OTP dưới đây để xác nhận đặt lại mật khẩu:");
            variables.put("expiryMinutes", 5);
            mailService.sendWithTemplate(email, "Mã xác nhận quên mật khẩu - Security Gate", "email/otp-email", variables);
        } catch (Exception e) {
            log.error("Lỗi gửi email quên mật khẩu: {}", e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi gửi email: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public ForgotPasswordResponseDTO forgotPassword(ForgotPasswordRequestDTO request) {
        if (!request.newPassword().equals(request.confirmPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Xác nhận mật khẩu mới không khớp");
        }

        OTP otp = otpRepository.findByEmailAndOtpCode(request.email(), request.otpCode())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã OTP không hợp lệ"));

        if (otp.getExpiryTime().isBefore(Instant.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã OTP đã hết hạn");
        }

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Người dùng không tồn tại"));

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
        otpRepository.deleteByEmail(request.email());

        return new ForgotPasswordResponseDTO(request.email(), "Mật khẩu đã được đặt lại thành công.", true);
    }

    @Override
    @Transactional
    public void sendResetPasswordOtp(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Người dùng không tồn tại"));

        String otpCode = String.format("%06d", new SecureRandom().nextInt(999999));
        otpRepository.deleteByEmail(email);
        OTP otp = OTP.builder()
                .email(email)
                .otpCode(otpCode)
                .expiryTime(Instant.now().plusSeconds(5 * 60))
                .build();
        otpRepository.save(otp);

        try {
            Map<String, Object> variables = new HashMap<>();
            variables.put("fullName", user.getFullName() != null ? user.getFullName() : user.getUsername());
            variables.put("otpCode", otpCode);
            variables.put("actionTitle", "Yêu cầu thay đổi mật khẩu");
            variables.put("actionMessage", "Hệ thống vừa nhận được yêu cầu thay đổi mật khẩu cho tài khoản của bạn. Để tiếp tục và bảo vệ an toàn cho tài khoản, vui lòng nhập mã OTP dưới đây để xác nhận thay đổi mật khẩu:");
            variables.put("expiryMinutes", 5);
            mailService.sendWithTemplate(email, "Mã xác nhận đổi mật khẩu - Security Gate", "email/otp-email", variables);
        } catch (Exception e) {
            log.error("Lỗi gửi email đổi mật khẩu: {}", e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi gửi email: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public ResetPasswordResponseDTO resetPassword(ResetPasswordRequestDTO request) {
        if (!request.newPassword().equals(request.confirmPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Xác nhận mật khẩu mới không khớp");
        }

        OTP otp = otpRepository.findByEmailAndOtpCode(request.email(), request.otpCode())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã OTP không hợp lệ"));

        if (otp.getExpiryTime().isBefore(Instant.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã OTP đã hết hạn");
        }

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Người dùng không tồn tại"));

        if (!passwordEncoder.matches(request.oldPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mật khẩu cũ không chính xác");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
        otpRepository.deleteByEmail(request.email());

        return new ResetPasswordResponseDTO(request.email(), "Mật khẩu đã được cập nhật thành công.", user.getId(), "/login");
    }

    @Override
    public ProfileDTO getProfile(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Người dùng không tồn tại"));

        return ProfileDTO.builder()
                .id(user.getId())
                .role(user.getRole())
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
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Người dùng không tồn tại"));

        userRepository.findByEmail(profile.email()).ifPresent(existingUser -> {
            if (!existingUser.getId().equals(id)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Email đã tồn tại");
            }
        });

        if (profile.phone() != null && !profile.phone().isBlank()) {
            userRepository.findByPhone(profile.phone()).ifPresent(existingUser -> {
                if (!existingUser.getId().equals(id)) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Số điện thoại đã tồn tại");
                }
            });
        }

        user.setFullName(profile.fullName());
        user.setEmail(profile.email());
        user.setPhone(profile.phone());
        user.setAddress(profile.address());
        userRepository.save(user);
    }
}
