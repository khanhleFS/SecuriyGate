package com.sep490.backend.common.security;

import com.sep490.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String userNameOrEmail) throws UsernameNotFoundException {
        return userRepository.findByEmailOrUsername(userNameOrEmail, userNameOrEmail)
                .map(CustomUserDetail::new)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng với: " + userNameOrEmail));
    }
}
