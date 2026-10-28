package com.sep490.backend.modules.auth.repository;

import com.sep490.backend.modules.auth.entity.OTP;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface OTPRepository extends JpaRepository<OTP, UUID> {
    Optional<OTP> findByEmailAndOtpCode(String email, String otpCode);
    void deleteByEmail(String email);
    void deleteByEmailAndOtpCode(String email, String otpCode);
}
