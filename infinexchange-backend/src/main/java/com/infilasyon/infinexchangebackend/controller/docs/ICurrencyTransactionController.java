package com.infilasyon.infinexchangebackend.controller.docs;
import com.infilasyon.infinexchangebackend.dto.request.CurrencyTransactionRequest;
import com.infilasyon.infinexchangebackend.dto.response.CurrencyTransactionResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;

@Tag(name = "Currency Transaction Controller", description = "Operations pertaining to currency transactions in InfinExchange system")
public interface ICurrencyTransactionController {

    @Operation(summary = "Buy Currency", description = "Buy a specified amount of currency", security = @SecurityRequirement(name = "bearerAuth"))
    ResponseEntity<CurrencyTransactionResponse> buyCurrency(@Valid CurrencyTransactionRequest request);

    @Operation(summary = "Sell Currency", description = "Sell a specified amount of currency", security = @SecurityRequirement(name = "bearerAuth"))
    ResponseEntity<CurrencyTransactionResponse> sellCurrency(@Valid CurrencyTransactionRequest request);
}