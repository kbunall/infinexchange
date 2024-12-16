package com.infilasyon.infinexchangebackend.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class CustomerProfileResponse {
    private CustomerResponse customerResponse;
    List<PortfolioResponse> portfolio = new ArrayList<>();
    List<AccountTransactionResponse> accountTransactions = new ArrayList<>();
    List<CurrencyTransactionResponse> currencyTransactions = new ArrayList<>();

}
