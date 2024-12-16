package com.infilasyon.infinexchangebackend.dto.response;
import com.infilasyon.infinexchangebackend.entity.enums.AccountTransactionType;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class AccountTransactionResponse {
    private Integer id;
    private Integer userId;
    private String userFirstName;
    private String userLastName;
    private String tcNo;
    private String taxNo;
    private Integer customerId;
    private String customerFirstName;
    private String customerLastName;
    private String corporationName;
    private AccountTransactionType accountTransactionType;
    private BigDecimal amount;
    private LocalDateTime transactionDate;
}
