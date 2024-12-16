package com.infilasyon.infinexchangebackend.config.auth;

import com.infilasyon.infinexchangebackend.entity.User;
import com.infilasyon.infinexchangebackend.exception.UserNotFoundException;
import com.infilasyon.infinexchangebackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetService {
    private final UserRepository userRepository;
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder;

    public void initiatePasswordReset(ForgotPasswordRequest request) {
        User user = userRepository.findByUsername(request.getUsername()).orElseThrow(() -> new UserNotFoundException("User not found."));
        String email = user.getEmail();
        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        userRepository.save(user);

        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(email);
        mailMessage.setSubject("Password Reset Request");
        mailMessage.setText("To reset your password, click the link below:\n" + "http://localhost:3000/reset?token=" + token);

        mailSender.send(mailMessage);
    }

    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByResetToken(request.getToken())
                .orElseThrow(() -> new InvalidResetPasswordTokenException("Invalid token."));
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetToken(null);
        userRepository.save(user);
    }
}