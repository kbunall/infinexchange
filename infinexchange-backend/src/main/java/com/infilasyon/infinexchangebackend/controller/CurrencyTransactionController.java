package com.infilasyon.infinexchangebackend.controller;

import com.infilasyon.infinexchangebackend.controller.docs.ICurrencyTransactionController;
import com.infilasyon.infinexchangebackend.dto.request.CurrencyTransactionRequest;
import com.infilasyon.infinexchangebackend.dto.response.CurrencyTransactionResponse;
import com.infilasyon.infinexchangebackend.entity.enums.CurrencyTransactionType;
import com.infilasyon.infinexchangebackend.service.CurrencyTransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/currency-transactions")
@RequiredArgsConstructor
@Validated
public class CurrencyTransactionController implements ICurrencyTransactionController {

    private final CurrencyTransactionService currencyTransactionService;
    @PostMapping("/buy")
    public ResponseEntity<CurrencyTransactionResponse> buyCurrency(
            @RequestBody @Valid CurrencyTransactionRequest request) {
        CurrencyTransactionResponse response = currencyTransactionService.buyCurrency(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    @PostMapping("/sell")
    public ResponseEntity<CurrencyTransactionResponse> sellCurrency(
            @RequestBody @Valid CurrencyTransactionRequest request) {
            CurrencyTransactionResponse response = currencyTransactionService.sellCurrency(request);
            return ResponseEntity.ok(response);

    }

    @GetMapping("/search")
    public List<CurrencyTransactionResponse> searchCurrencyTransactions(@RequestParam(required = false) Integer customerId,
                                                                        @RequestParam(required = false) String customerFirstName,
                                                                        @RequestParam(required = false) String customerLastName,
                                                                        @RequestParam(required = false) String customerCorporationName,
                                                                        @RequestParam(required = false) Integer userId,
                                                                        @RequestParam(required = false) String username,
                                                                        @RequestParam(required = false) CurrencyTransactionType type,
                                                                        @RequestParam(required = false) String currencyCode,
                                                                        @RequestParam(required = false) BigDecimal amount,
                                                                        @RequestParam(required = false) BigDecimal exchangeRate,
                                                                        @RequestParam(required = false) LocalDateTime transactionDate,
                                                                        @RequestParam(required = false) String targetCurrencyCode) {

        return currencyTransactionService.findCurrencyTransactionsByCriteria(customerId, customerFirstName, customerLastName, customerCorporationName,
                userId,username, type, currencyCode, amount, exchangeRate, transactionDate, targetCurrencyCode);
    }

    @GetMapping
    public ResponseEntity<List<CurrencyTransactionResponse>> getAll() {
        List<CurrencyTransactionResponse> transactions = currencyTransactionService.getAllTransactionsByUserRole();
        return ResponseEntity.ok(transactions);
    }
}
