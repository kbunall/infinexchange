package com.infilasyon.infinexchangebackend.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class WithdrawalRequest {
    @NotNull
    private Integer customerId;
    @Positive
    @NotNull
    private BigDecimal amount;
}
