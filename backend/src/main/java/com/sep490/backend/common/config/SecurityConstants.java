package com.sep490.backend.common.config;

public class SecurityConstants {
    public static final String[] PUBLIC_MATCHERS = {
            "/swagger-ui/**",
            "/swagger-ui.html",
            "/v3/api-docs/**",
            "/v3/api-docs.yaml",
            "/api/auth/**",
            "/api/users/forgot-password/**",
            "/error",
            "/favicon.ico"
    };
}
