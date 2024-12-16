package com.infilasyon.infinexchangebackend.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
@Getter
@Setter
public class CurrencyTransactionRequest {
    @NotNull
    private Integer customerId;
    @NotNull
    private String currencyCode;
    @NotNull
    @Positive
    private BigDecimal amount;
    @NotNull
    private String buyCurrencyCode;
}
