package com.infilasyon.infinexchangebackend.entity;

import com.infilasyon.infinexchangebackend.entity.enums.CustomerType;
import com.infilasyon.infinexchangebackend.entity.enums.Role;
import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Entity
@Table
@Data
public class Customer implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column
    private String firstName;
    @Column
    private String lastName;

    @Column
    private String corporationName;

    @Column(nullable = false, length = 1)
    @Enumerated(EnumType.STRING)
    private CustomerType type;
    @Column
    private String tcNo;

    @Column
    private String taxNo;

    @Column
    @Temporal(TemporalType.DATE)
    private Date dateOfBirth;

    @Column(nullable = false)
    private String phoneNumber;

    @Column
    private String address;

    @Column
    private String email;

    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdDate;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal balance;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    private List<CurrencyTransaction> currencyTransactions;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    private List<AccountTransaction> accountTransactions;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    private List<Portfolio> portfolio;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
