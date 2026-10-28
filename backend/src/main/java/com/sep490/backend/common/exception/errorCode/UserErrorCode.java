package com.sep490.backend.common.exception.errorCode;

import com.sep490.backend.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

/**
 * Mã lỗi nghiệp vụ cho phân hệ User (10xxx).
 * Bao gồm các tình huống:
 * - Thông tin tài khoản & hồ sơ cá nhân
 * - Quên mật khẩu & gửi mã OTP khôi phục
 * - Đổi mật khẩu tài khoản
 */
@Getter
@RequiredArgsConstructor
public enum UserErrorCode implements ErrorCode {

    // 10001 - 10005: Quản lý thông tin & trạng thái người dùng
    USER_NOT_FOUND(10001, "Người dùng không tồn tại", HttpStatus.NOT_FOUND, "user.not_found"),
    USER_ALREADY_EXISTS(10002, "Người dùng đã tồn tại trong hệ thống", HttpStatus.CONFLICT, "user.already_exists"),
    USER_INACTIVE(10003, "Tài khoản người dùng đang bị vô hiệu hóa", HttpStatus.FORBIDDEN, "user.inactive"),
    PROFILE_UPDATE_FAILED(10004, "Cập nhật thông tin người dùng thất bại", HttpStatus.INTERNAL_SERVER_ERROR, "user.update_failed"),
    UNAUTHORIZED_PROFILE_ACCESS(10005, "Bạn không có quyền truy cập thông tin tài khoản này", HttpStatus.FORBIDDEN, "user.unauthorized_access"),

    // 10006 - 10008: Kiểm tra trùng lặp thông tin
    EMAIL_ALREADY_EXISTS(10006, "Email đã được sử dụng bởi người dùng khác", HttpStatus.CONFLICT, "user.email_exists"),
    USERNAME_ALREADY_EXISTS(10007, "Tên người dùng đã được sử dụng", HttpStatus.CONFLICT, "user.username_exists"),
    PHONE_ALREADY_EXISTS(10008, "Số điện thoại đã được sử dụng bởi người dùng khác", HttpStatus.CONFLICT, "user.phone_exists"),

    // 10009 - 10011: Quy trình Quên mật khẩu (Forgot Password)
    EMAIL_NOT_FOUND(10009, "Email không tồn tại trong hệ thống", HttpStatus.NOT_FOUND, "user.email_not_found"),
    FORGOT_PASSWORD_OTP_INVALID(10010, "Mã OTP khôi phục mật khẩu không hợp lệ", HttpStatus.BAD_REQUEST, "user.forgot_password_otp_invalid"),
    FORGOT_PASSWORD_OTP_EXPIRED(10011, "Mã OTP khôi phục mật khẩu đã hết hạn", HttpStatus.BAD_REQUEST, "user.forgot_password_otp_expired"),

    // 10012 - 10017: Quy trình Đổi mật khẩu (Reset/Change Password)
    OLD_PASSWORD_INCORRECT(10012, "Mật khẩu cũ không chính xác", HttpStatus.BAD_REQUEST, "user.old_password_incorrect"),
    PASSWORD_CONFIRMATION_MISMATCH(10013, "Xác nhận mật khẩu mới không khớp", HttpStatus.BAD_REQUEST, "user.password_not_match"),
    PASSWORD_SAME_AS_OLD(10014, "Mật khẩu mới không được trùng với mật khẩu cũ", HttpStatus.BAD_REQUEST, "user.password_same_as_old"),
    RESET_PASSWORD_OTP_INVALID(10015, "Mã OTP đổi mật khẩu không hợp lệ", HttpStatus.BAD_REQUEST, "user.reset_password_otp_invalid"),
    RESET_PASSWORD_OTP_EXPIRED(10016, "Mã OTP đổi mật khẩu đã hết hạn", HttpStatus.BAD_REQUEST, "user.reset_password_otp_expired"),
    SEND_EMAIL_FAILED(10017, "Gửi email xác nhận thất bại", HttpStatus.INTERNAL_SERVER_ERROR, "user.send_email_failed");

    private final int code;
    private final String message;
    private final HttpStatus status;
    private final String errorKey;

    @Override
    public String getDomain() {
        return "USER";
    }
}
