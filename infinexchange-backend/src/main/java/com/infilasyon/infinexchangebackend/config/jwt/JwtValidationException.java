package com.infilasyon.infinexchangebackend.config.jwt;

public class JwtValidationException extends Exception{
    public JwtValidationException(String message, Throwable cause) {
        super(message, cause);
    }

}
