package com.infilasyon.infinexchangebackend.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class PortfolioDetailsResponse {
    private String taxNo;
    private String tcNo;
    private String corporationName;
    private String firsName;
    private String lastName;
    private String currencyCode;
    private BigDecimal amount;
}