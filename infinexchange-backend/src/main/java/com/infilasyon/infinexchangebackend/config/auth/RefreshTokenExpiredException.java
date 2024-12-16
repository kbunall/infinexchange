package com.infilasyon.infinexchangebackend.config.auth;

public class RefreshTokenExpiredException extends RuntimeException {
    public RefreshTokenExpiredException() {
        super(("Refresh token expired. Please login again."));
    }
}