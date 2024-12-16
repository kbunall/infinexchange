package com.infilasyon.infinexchangebackend.config.auth;

import com.infilasyon.infinexchangebackend.config.CustomUserDetails;
import com.infilasyon.infinexchangebackend.config.auth.docs.IAuthController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/oauth")
@RequiredArgsConstructor
@Validated
public class AuthController implements IAuthController {
    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;
    private final PasswordResetService passwordResetService;

    @PostMapping("/token")
    public ResponseEntity<?> getAccessToken(@RequestBody @Valid AuthRequest request) {
        String username = request.getUsername();
        String password = request.getPassword();

        Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password));

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        AuthResponse response = tokenService.generateTokens(userDetails.getUser());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/token/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody @Valid RefreshTokenRequest request) {
        AuthResponse response = tokenService.refreshTokens(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/password/forgot")
    public ResponseEntity<?> forgotPassword(@RequestBody @Valid ForgotPasswordRequest request) {
            passwordResetService.initiatePasswordReset(request);
            return ResponseEntity.ok("Password reset link sent. Please check your email.");
    }

    @PostMapping("/password/reset")
    public ResponseEntity<?> resetPassword(@RequestBody @Valid ResetPasswordRequest request) {
            passwordResetService.resetPassword(request);
            return ResponseEntity.ok("Password reset successfully.");
    }

}
