package com.infilasyon.infinexchangebackend.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class PortfolioResponse {
    private String currencyCode;
    private BigDecimal amount;
    private BigDecimal percentage;
}
