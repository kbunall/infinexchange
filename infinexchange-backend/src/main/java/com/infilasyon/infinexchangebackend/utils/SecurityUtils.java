package com.infilasyon.infinexchangebackend.utils;

import com.infilasyon.infinexchangebackend.config.CustomUserDetails;
import com.infilasyon.infinexchangebackend.entity.User;
import com.infilasyon.infinexchangebackend.exception.UserNotFoundException;
import com.infilasyon.infinexchangebackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SecurityUtils {

    private final UserRepository userRepository;

    public User getAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Integer authenticatedUserId = ((CustomUserDetails) principal).getUser().getId();
        return userRepository.findById(authenticatedUserId)
                .orElseThrow(() -> new UserNotFoundException("User not found with the given id: " + authenticatedUserId));
    }
}