package com.infilasyon.infinexchangebackend.exception;

public class CustomerCurrencyNotFoundException extends RuntimeException {
    public CustomerCurrencyNotFoundException(Integer customerId, String currencyCode) {
        super("Customer with ID " + customerId + " does not have currency with code " + currencyCode);
    }
}