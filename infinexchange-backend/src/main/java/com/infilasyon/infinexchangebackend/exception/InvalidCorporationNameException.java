package com.infilasyon.infinexchangebackend.exception;
public class InvalidCorporationNameException extends RuntimeException {
    public InvalidCorporationNameException(String message) {
        super(message);
    }
}