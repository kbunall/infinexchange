package com.infilasyon.infinexchangebackend.entity;

import com.infilasyon.infinexchangebackend.entity.enums.CurrencyTransactionType;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table
@Data
public class CurrencyTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false)
    private CurrencyTransactionType currencyTransactionType;

    @Column(name = "currency_code", nullable = false, length = 7)
    private String currencyCode;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(name = "exchange_rate", precision = 10, scale = 4)
    private BigDecimal exchangeRate;

    @Column(name = "transaction_date", nullable = false)
    private LocalDateTime transactionDate;

    @Column(name = "target_currency_code", length = 7)
    private String targetCurrencyCode;

}
