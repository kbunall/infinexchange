package com.infilasyon.infinexchangebackend.controller.docs;
import com.infilasyon.infinexchangebackend.dto.request.DepositRequest;
import com.infilasyon.infinexchangebackend.dto.request.WithdrawalRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;

@Tag(name = "Account Transaction Controller", description = "Operations pertaining to account transactions in InfinExchange system")
public interface IAccountTransactionController {

    @Operation(summary = "Deposit Money", description = "Deposit a specified amount into the customer's account", security = @SecurityRequirement(name = "bearerAuth"))
    ResponseEntity<String> deposit(@Valid DepositRequest depositRequest);

    @Operation(summary = "Withdraw Money", description = "Withdraw a specified amount from the customer's account", security = @SecurityRequirement(name = "bearerAuth"))
    ResponseEntity<String> withdraw(@Valid WithdrawalRequest withdrawalRequest);
}