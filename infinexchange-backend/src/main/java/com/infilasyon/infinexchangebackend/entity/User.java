package com.infilasyon.infinexchangebackend.entity;

import com.infilasyon.infinexchangebackend.entity.enums.Role;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, nullable = false, length = 20)
    private String username;

    @Column(nullable = false, length = 50)
    private String firstName;

    @Column(nullable = false, length = 500)
    private String lastName;

    @Column(length = 80)
    private String email;

    @Column(nullable = false, length = 80)
    private String password;

    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdDate;

    @Column
    private String resetToken;

    @Column(nullable = false, length = 10)
    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private Set<CurrencyTransaction> currencyTransactions;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Customer> customers;
}
