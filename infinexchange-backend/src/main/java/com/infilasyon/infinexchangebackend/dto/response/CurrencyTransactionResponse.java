package com.infilasyon.infinexchangebackend.dto.response;

import com.infilasyon.infinexchangebackend.entity.enums.CurrencyTransactionType;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
@Getter
@Setter
public class CurrencyTransactionResponse {
    private Integer id;
    private Integer customerId;
    private Integer userId;
    private String userName;
    private String customerFirstName;
    private String customerLastName;
    private String companyName;
    private CurrencyTransactionType currencyTransactionType;
    private String currencyCode;
    private String buyCurrencyCode;
    private BigDecimal amount;
    private BigDecimal exchangeRate;
    private LocalDateTime transactionDate;
}
