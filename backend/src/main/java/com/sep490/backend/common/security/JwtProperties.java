package com.sep490.backend.common.security;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "jwt")
@Getter
@Setter
public class JwtProperties {
    private String secret;
    private long accessTokenExpiration;   // Mili-giây (VD: 900000 = 15 phút)
    private long refreshTokenExpiration;  // Mili-giây (VD: 604800000 = 7 ngày)
}
