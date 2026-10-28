package com.sep490.backend.common.mail;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * Định nghĩa loại email OTP và nội dung tiêu đề/thông điệp tương ứng.
 */
@Getter
@RequiredArgsConstructor
public enum OtpEmailType {

    REGISTER(
        "Xác nhận đăng ký tài khoản",
        "Hệ thống vừa nhận được yêu cầu đăng ký tài khoản vào hệ thống Security Gate. Để tiếp tục và bảo vệ an toàn cho tài khoản, vui lòng nhập mã OTP dưới đây để hoàn tất đăng ký:",
        "Xác nhận đăng ký tài khoản - Security Gate"
    ),

    RESEND_REGISTER(
        "Gửi lại mã xác nhận kích hoạt tài khoản",
        "Hệ thống vừa nhận được yêu cầu gửi lại mã OTP để kích hoạt tài khoản Security Gate của bạn. Để hoàn tất kích hoạt, vui lòng nhập mã OTP dưới đây:",
        "Gửi lại mã xác nhận đăng ký tài khoản - Security Gate"
    ),

    FORGOT_PASSWORD(
        "Yêu cầu đặt lại mật khẩu",
        "Hệ thống vừa nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Để tiếp tục và bảo vệ an toàn cho tài khoản, vui lòng nhập mã OTP dưới đây để xác nhận đặt lại mật khẩu:",
        "Mã xác nhận quên mật khẩu - Security Gate"
    ),

    RESET_PASSWORD(
        "Yêu cầu thay đổi mật khẩu",
        "Hệ thống vừa nhận được yêu cầu thay đổi mật khẩu cho tài khoản của bạn. Để tiếp tục và bảo vệ an toàn cho tài khoản, vui lòng nhập mã OTP dưới đây để xác nhận thay đổi mật khẩu:",
        "Mã xác nhận đổi mật khẩu - Security Gate"
    );

    private final String actionTitle;
    private final String actionMessage;
    private final String subject;
}
