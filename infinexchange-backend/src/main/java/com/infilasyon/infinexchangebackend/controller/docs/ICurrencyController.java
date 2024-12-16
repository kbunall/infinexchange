package com.infilasyon.infinexchangebackend.controller.docs;
import com.infilasyon.infinexchangebackend.entity.Currency;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;


import java.math.BigDecimal;
import java.util.List;
@Tag(name = "Currency Controller", description = "Operations pertaining to currencies in Currency Management System")
public interface ICurrencyController {
    @Operation(summary = "View All Currencies", description = "Retrieve a list of all currencies", security = @SecurityRequirement(name = "bearerAuth"))
    List<Currency> getAllCurrencies();
    @Operation(summary = "Get Currency by Code", description = "Retrieve a specific currency by its code", security = @SecurityRequirement(name = "bearerAuth"))
    ResponseEntity<Currency> getCurrencyByCode(String code);
    @Operation(summary = "Create Currency", description = "Create a new currency", security = @SecurityRequirement(name = "bearerAuth"))
    Currency createCurrency(Currency currency);
    @Operation(summary = "Update Currency", description = "Update an existing currency", security = @SecurityRequirement(name = "bearerAuth"))
    ResponseEntity<Currency> updateCurrency(String code, BigDecimal buying, BigDecimal selling);

    @Operation(summary = "Delete Currency", description = "Delete a specific currency", security = @SecurityRequirement(name = "bearerAuth"))
    ResponseEntity<Void> deleteCurrency(String code);
}
