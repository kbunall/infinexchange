package com.infilasyon.infinexchangebackend.repository.specifications;
import com.infilasyon.infinexchangebackend.entity.CurrencyTransaction;
import com.infilasyon.infinexchangebackend.entity.enums.CurrencyTransactionType;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CurrencyTransactionSpecifications {

    public static Specification<CurrencyTransaction> hasCustomerId(Integer customerId) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("customer").get("id"), customerId);
    }

    public static Specification<CurrencyTransaction> hasCustomerFirstName(String firstName) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("customer").get("firstName"), firstName);
    }

    public static Specification<CurrencyTransaction> hasCustomerLastName(String lastName) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("customer").get("lastName"), lastName);
    }

    public static Specification<CurrencyTransaction> hasCorporationName(String corporationName) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("customer").get("corporationName"), corporationName);
    }

    public static Specification<CurrencyTransaction> hasUserId(Integer userId) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("user").get("id"), userId);
    }

    public static Specification<CurrencyTransaction> hasUserName(String username) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("user").get("username"), username);
    }

    public static Specification<CurrencyTransaction> hasCurrencyTransactionType(CurrencyTransactionType type) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("currencyTransactionType"), type);
    }

    public static Specification<CurrencyTransaction> hasCurrencyCode(String currencyCode) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("currencyCode"), currencyCode);
    }

    public static Specification<CurrencyTransaction> hasAmount(BigDecimal amount) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("amount"), amount);
    }

    public static Specification<CurrencyTransaction> hasExchangeRate(BigDecimal exchangeRate) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("exchangeRate"), exchangeRate);
    }

    public static Specification<CurrencyTransaction> hasTransactionDate(LocalDateTime transactionDate) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("transactionDate"), transactionDate);
    }

    public static Specification<CurrencyTransaction> hasTargetCurrencyCode(String targetCurrencyCode) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("targetCurrencyCode"), targetCurrencyCode);
    }
}