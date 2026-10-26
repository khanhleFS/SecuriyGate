package com.sep490.backend.common.exception;

import com.sep490.backend.common.response.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiResponse<Void>> handleApiException(ApiException ex, HttpServletRequest request) {
        log.warn("Business Exception: {} - {}", ex.getErrorCode().getCode(), ex.getMessage());
        ErrorCode errorCode = ex.getErrorCode();
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .code(errorCode.getCode())
                .message(ex.getMessage() != null ? ex.getMessage() : errorCode.getMessage())
                .errorKey(errorCode.getErrorKey())
                .timestamp(Instant.now())
                .path(request.getRequestURI())
                .build();
        return ResponseEntity.status(errorCode.getStatus()).body(response);
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiResponse<Void>> handleResponseStatusException(ResponseStatusException ex, HttpServletRequest request) {
        log.warn("ResponseStatusException: {} - {}", ex.getStatusCode(), ex.getReason());
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .code(ex.getStatusCode().value())
                .message(ex.getReason())
                .timestamp(Instant.now())
                .path(request.getRequestURI())
                .build();
        return ResponseEntity.status(ex.getStatusCode()).body(response);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<Void>> handleBadCredentialsException(BadCredentialsException ex, HttpServletRequest request) {
        log.warn("BadCredentialsException: {}", ex.getMessage());
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .code(HttpStatus.UNAUTHORIZED.value())
                .message("Tên đăng nhập hoặc mật khẩu không chính xác")
                .errorKey("auth.invalid_credentials")
                .timestamp(Instant.now())
                .path(request.getRequestURI())
                .build();
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationException(MethodArgumentNotValidException ex, HttpServletRequest request) {
        Map<String, String> errors = new HashMap<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            errors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .code(HttpStatus.BAD_REQUEST.value())
                .message("Dữ liệu đầu vào không hợp lệ")
                .errorKey("common.validation_failed")
                .errors(errors)
                .timestamp(Instant.now())
                .path(request.getRequestURI())
                .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneralException(Exception ex, HttpServletRequest request) {
        log.error("Internal Server Error: ", ex);
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .message("Đã xảy ra lỗi hệ thống, vui lòng thử lại sau")
                .errorKey("common.internal_error")
                .timestamp(Instant.now())
                .path(request.getRequestURI())
                .build();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
