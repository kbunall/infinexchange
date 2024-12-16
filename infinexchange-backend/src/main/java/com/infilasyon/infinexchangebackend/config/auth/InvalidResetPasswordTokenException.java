package com.infilasyon.infinexchangebackend.config.auth;

public class InvalidResetPasswordTokenException extends RuntimeException {
    public InvalidResetPasswordTokenException(String message) {
        super(message);
    }

}