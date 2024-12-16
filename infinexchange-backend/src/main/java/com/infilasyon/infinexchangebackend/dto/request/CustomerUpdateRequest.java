package com.infilasyon.infinexchangebackend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;
@Getter
@Setter
public class CustomerUpdateRequest {
    private String firstName;

    private String lastName;

    private String corporationName;

    @NotBlank
    @Pattern(regexp = "^[BK]$", message = "Tip değeri bireysel müşteriler icin 'B', kurumsal müşteriler icin 'K' olmalıdır.")
    private String  type;

    private String tcNo;

    private String taxNo;

    private String address;

    private Date dateOfBirth;

    @Pattern(regexp = "^\\+?\\d{10,15}$", message = "Geçersiz telefon numarası formatı. + ve 10-15 rakam içermelidir.")
    private String phoneNumber;

    @Email
    private String email;

}
