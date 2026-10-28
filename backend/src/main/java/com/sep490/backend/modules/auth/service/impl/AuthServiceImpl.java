package com.sep490.backend.modules.auth.service.impl;

import com.sep490.backend.common.mail.OtpEmailType;
import com.sep490.backend.common.mail.OtpMailHelper;
import com.sep490.backend.common.security.CustomUserDetail;
import com.sep490.backend.common.security.JwtService;
import com.sep490.backend.common.security.TokenBlacklistService;
import com.sep490.backend.modules.auth.dto.*;
import com.sep490.backend.modules.auth.entity.OTP;
import com.sep490.backend.modules.auth.entity.RefreshTokenRedis;
import com.sep490.backend.modules.auth.repository.OTPRepository;
import com.sep490.backend.modules.auth.repository.RefreshTokenRedisRepository;
import com.sep490.backend.modules.auth.service.AuthService;
import com.sep490.backend.modules.user.dto.*;
import com.sep490.backend.modules.user.entity.User;
import com.sep490.backend.modules.user.entity.UserRole;
import com.sep490.backend.modules.user.repository.UserRepository;
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
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpMailHelper otpMailHelper;
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
            otpMailHelper.sendOtpMail(request.email(), request.fullName(), otpCode, OtpEmailType.REGISTER);
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
    public void resendRegisterOtp(String email) {
        if (email == null || email.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email không được để trống.");
        }

        User user = userRepository.findByEmail(email.trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy thông tin đăng ký với email này."));

        if (Boolean.TRUE.equals(user.getIsActive())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tài khoản này đã được kích hoạt trước đó. Vui lòng đăng nhập.");
        }

        // Sinh OTP 6 chữ số mới
        String otpCode = String.format("%06d", new SecureRandom().nextInt(999999));
        otpRepository.deleteByEmail(user.getEmail());
        OTP otp = OTP.builder()
                .email(user.getEmail())
                .otpCode(otpCode)
                .expiryTime(Instant.now().plusSeconds(5 * 60)) // Hạn 5 phút
                .build();
        otpRepository.save(otp);

        try {
            String recipientName = user.getFullName() != null ? user.getFullName() : user.getUsername();
            otpMailHelper.sendOtpMail(user.getEmail(), recipientName, otpCode, OtpEmailType.RESEND_REGISTER);
        } catch (Exception e) {
            log.error("Không thể gửi lại email OTP kích hoạt: {}", e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Không thể gửi email OTP: " + e.getMessage());
        }
    }
}
