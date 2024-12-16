package com.infilasyon.infinexchangebackend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;


@Getter
@Setter
@Entity
@Table(name = "currencies")
public class Currency {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code;

    @Column(unique = true, nullable = false)
    private String currencyName;

    @Column(nullable = false, precision = 19, scale = 4)
    @NotNull
    private BigDecimal buying;

    @Column(nullable = false, precision = 19, scale = 4)
    @NotNull
    private BigDecimal selling;

    @Column(nullable = false)
    @NotNull
    private String unit;

    @Column(nullable = false, precision = 19, scale = 4)
    @NotNull
    private BigDecimal priceChangePercentage;

    private Date updatedDate;
}
