package com.sep490.backend.repository;

import com.sep490.backend.entity.OTP;
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
