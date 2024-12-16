package com.infilasyon.infinexchangebackend.controller;

import com.infilasyon.infinexchangebackend.controller.docs.IAccountTransactionController;
import com.infilasyon.infinexchangebackend.dto.request.DepositRequest;
import com.infilasyon.infinexchangebackend.dto.request.WithdrawalRequest;
import com.infilasyon.infinexchangebackend.dto.response.AccountTransactionResponse;
import com.infilasyon.infinexchangebackend.entity.enums.AccountTransactionType;
import com.infilasyon.infinexchangebackend.service.AccountTransactionService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/account-transactions")
@Validated
public class AccountTransactionController implements IAccountTransactionController {

    private final AccountTransactionService accountTransactionService;

    public AccountTransactionController(AccountTransactionService accountTransactionService) {
        this.accountTransactionService = accountTransactionService;
    }

    @PostMapping("/deposit")
    public ResponseEntity<String> deposit(
            @RequestBody @Valid DepositRequest depositRequest) {
            accountTransactionService.deposit(depositRequest);
            return ResponseEntity.ok("Deposit successfully.");

    }
    @PostMapping("/withdraw")
    public ResponseEntity<String> withdraw(
            @RequestBody @Valid WithdrawalRequest withdrawalRequest) {
            accountTransactionService.withdraw(withdrawalRequest);
            return ResponseEntity.ok("Withdrawal successfully");

    }

    @GetMapping
    public ResponseEntity<List<AccountTransactionResponse>> getAll() {
        List<AccountTransactionResponse> transactions = accountTransactionService.getAllTransactionsByUserRole();
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/search")
    public ResponseEntity<List<AccountTransactionResponse>> searchTransactions(
            @RequestParam(required = false) Integer customerId,
            @RequestParam(required = false) Integer userId,
            @RequestParam(required = false) AccountTransactionType transactionType,
            @RequestParam(required = false) BigDecimal minAmount,
            @RequestParam(required = false) BigDecimal maxAmount,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(required = false) String customerFirstName,
            @RequestParam(required = false) String customerLastName,
            @RequestParam(required = false) String tcNo,
            @RequestParam(required = false) String corporationName,
            @RequestParam(required = false) String taxNo) {

        validateParameters(minAmount, maxAmount, startDate, endDate);

        List<AccountTransactionResponse> transactions = accountTransactionService.findTransactionsByCriteria(
                customerId, userId, transactionType, minAmount, maxAmount, startDate, endDate,
                customerFirstName, customerLastName, tcNo, corporationName, taxNo);
        return ResponseEntity.ok(transactions);
    }

    private void validateParameters(BigDecimal minAmount, BigDecimal maxAmount,
                                    LocalDateTime startDate, LocalDateTime endDate) {
        if (minAmount != null && minAmount.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Minimum amount must be greater than or equal to zero.");
        }
        if (maxAmount != null && maxAmount.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Maximum amount must be greater than or equal to zero.");
        }
        if (startDate != null && endDate != null && startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Start date must be before end date.");
        }
    }
}
