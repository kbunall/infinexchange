package com.infilasyon.infinexchangebackend.exception;

public class NewPasswordSameAsOldException extends RuntimeException {
    public NewPasswordSameAsOldException(String message) {
        super(message);
    }
}