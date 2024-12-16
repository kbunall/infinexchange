package com.infilasyon.infinexchangebackend.dto.request;

import com.infilasyon.infinexchangebackend.entity.enums.CustomerType;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;

@Getter
@Setter
public class CustomerRequest {

    private String firstName;

    private String lastName;

    private String corporationName;

    @NotBlank
    @Pattern(regexp = "^[BK]$", message = "Tip değeri bireysel müşteriler icin 'B', kurumsal müşteriler icin 'K' olmalıdır.")
    private String  type;

    //@Size(min = 11, max = 11, message = "TC Kimlik No 11 karakter uzunlugunda olmalidir.")
    private String tcNo;

    //@Size(min = 10, max = 10, message = "Vergi no 10 karakter uzunluğunda olmalıdır.")
    private String taxNo;

    private String address;

    private Date dateOfBirth;

    @Pattern(regexp = "^\\+?\\d{10,15}$", message = "Geçersiz telefon numarası formatı. + ve 10-15 rakam içermelidir.")
    private String phoneNumber;

    @Email
    private String email;

    @PositiveOrZero
    private BigDecimal balance;

}
