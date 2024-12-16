package com.infilasyon.infinexchangebackend.config.auth;

public class RefreshTokenNotFoundException extends RuntimeException {
    public RefreshTokenNotFoundException() {
        super("Refresh token not found. Please login again.");
    }
}