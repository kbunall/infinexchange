package com.infilasyon.infinexchangebackend.exception;
public class CorporationNameAlreadyExistsException extends RuntimeException {
    public CorporationNameAlreadyExistsException(String message) {
        super(message);
    }
}