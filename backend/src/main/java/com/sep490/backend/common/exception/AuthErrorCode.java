package com.sep490.backend.common.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum AuthErrorCode implements ErrorCode {
    USER_NOT_FOUND(11001, "Người dùng không tồn tại", HttpStatus.NOT_FOUND, "auth.user_not_found"),
    INVALID_CREDENTIALS(11002, "Tên đăng nhập hoặc mật khẩu không chính xác", HttpStatus.UNAUTHORIZED, "auth.invalid_credentials"),
    ACCOUNT_LOCKED(11003, "Tài khoản của bạn đã bị khóa hoặc chưa kích hoạt", HttpStatus.FORBIDDEN, "auth.account_locked"),
    OTP_INVALID(11004, "Mã OTP không hợp lệ", HttpStatus.BAD_REQUEST, "auth.otp_invalid"),
    OTP_EXPIRED(11005, "Mã OTP đã hết hạn", HttpStatus.BAD_REQUEST, "auth.otp_expired"),
    EMAIL_ALREADY_EXISTS(11006, "Email đã tồn tại", HttpStatus.CONFLICT, "auth.email_exists"),
    USERNAME_ALREADY_EXISTS(11007, "Tên người dùng đã tồn tại", HttpStatus.CONFLICT, "auth.username_exists"),
    PHONE_ALREADY_EXISTS(11008, "Số điện thoại đã tồn tại", HttpStatus.CONFLICT, "auth.phone_exists"),
    PASSWORD_NOT_MATCH(11009, "Mật khẩu và xác nhận mật khẩu không khớp", HttpStatus.BAD_REQUEST, "auth.password_not_match"),
    OLD_PASSWORD_INCORRECT(11010, "Mật khẩu cũ không chính xác", HttpStatus.BAD_REQUEST, "auth.old_password_incorrect"),
    TOKEN_INVALID_OR_EXPIRED(11011, "Token không hợp lệ hoặc đã hết hạn", HttpStatus.UNAUTHORIZED, "auth.token_invalid");

    private final int code;
    private final String message;
    private final HttpStatus status;
    private final String errorKey;

    @Override
    public String getDomain() {
        return "AUTH";
    }
}
