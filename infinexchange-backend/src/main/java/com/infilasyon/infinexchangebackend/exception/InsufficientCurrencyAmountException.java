package com.infilasyon.infinexchangebackend.exception;

import java.math.BigDecimal;

public class InsufficientCurrencyAmountException extends RuntimeException {
    public InsufficientCurrencyAmountException(BigDecimal amountInDB, BigDecimal requestedAmount) {
        super("Insufficient currency amount: Requested " + requestedAmount + " but only " + amountInDB + " available.");
    }
}