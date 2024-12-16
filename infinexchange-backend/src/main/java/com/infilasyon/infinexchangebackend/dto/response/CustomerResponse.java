package com.infilasyon.infinexchangebackend.dto.response;
import com.infilasyon.infinexchangebackend.entity.enums.CustomerType;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;

@Getter
@Setter
public class CustomerResponse {
    private int id;
    private String firstName;

    private String lastName;

    private String corporationName;

    private CustomerType type;

    private String tcNo;

    private String address;

    private String taxNo;

    private Date dateOfBirth;

    private String phoneNumber;

    private String email;

    private BigDecimal balance;

    private String user;

}
