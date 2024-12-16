package com.infilasyon.infinexchangebackend.repository.specifications;

import com.infilasyon.infinexchangebackend.entity.AccountTransaction;
import com.infilasyon.infinexchangebackend.entity.enums.AccountTransactionType;
import org.springframework.data.jpa.domain.Specification;
import java.time.LocalDateTime;
import java.math.BigDecimal;

public class AccountTransactionSpecifications {

    public static Specification<AccountTransaction> hasCustomerId(Integer customerId) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("customer").get("id"), customerId);
    }

    public static Specification<AccountTransaction> hasUserId(Integer userId) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("user").get("id"), userId);
    }

    public static Specification<AccountTransaction> hasTransactionType(AccountTransactionType transactionType) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("accountTransactionType"), transactionType);
    }

    public static Specification<AccountTransaction> hasMinAmount(BigDecimal minAmount) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.greaterThanOrEqualTo(root.get("amount"), minAmount);
    }

    public static Specification<AccountTransaction> hasMaxAmount(BigDecimal maxAmount) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.lessThanOrEqualTo(root.get("amount"), maxAmount);
    }

    public static Specification<AccountTransaction> hasStartDate(LocalDateTime startDate) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.greaterThanOrEqualTo(root.get("transactionDate"), startDate);
    }

    public static Specification<AccountTransaction> hasEndDate(LocalDateTime endDate) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.lessThanOrEqualTo(root.get("transactionDate"), endDate);
    }

    public static Specification<AccountTransaction> hasCustomerFirstName(String firstName) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(root.get("customer").get("firstName"), "%" + firstName + "%");
    }

    public static Specification<AccountTransaction> hasCustomerLastName(String lastName) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(root.get("customer").get("lastName"), "%" + lastName + "%");
    }

    public static Specification<AccountTransaction> hasTcNo(String tcNo) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("customer").get("tcNo"), tcNo);
    }

    public static Specification<AccountTransaction> hasCorporationName(String corporationName) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(root.get("customer").get("corporationName"), "%" + corporationName + "%");
    }

    public static Specification<AccountTransaction> hasTaxNo(String taxNo) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("customer").get("taxNo"), taxNo);
    }
}
