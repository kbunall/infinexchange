package com.infilasyon.infinexchangebackend.exception;

public class NotUniqueUsernameException extends RuntimeException {
    public NotUniqueUsernameException(String message) {
        super(message);
    }
}