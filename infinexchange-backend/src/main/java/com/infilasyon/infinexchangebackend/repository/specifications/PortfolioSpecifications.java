package com.infilasyon.infinexchangebackend.repository.specifications;

import com.infilasyon.infinexchangebackend.entity.Portfolio;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;

public class PortfolioSpecifications {
    public static Specification<Portfolio> hasTaxNo(String taxNo) {
        return (root, query, cb) -> taxNo == null ? null : cb.equal(root.get("customer").get("taxNo"), taxNo);
    }

    public static Specification<Portfolio> hasTcNo(String tcNo) {
        return (root, query, cb) -> tcNo == null ? null : cb.equal(root.get("customer").get("tcNo"), tcNo);
    }

    public static Specification<Portfolio> hasCorporationName(String corporationName) {
        return (root, query, cb) -> corporationName == null ? null : cb.like(root.get("customer").get("corporationName"), "%" + corporationName + "%");
    }

    public static Specification<Portfolio> hasFirstName(String firstName) {
        return (root, query, cb) -> firstName == null ? null : cb.like(root.get("customer").get("firstName"), "%" + firstName + "%");
    }

    public static Specification<Portfolio> hasLastName(String lastName) {
        return (root, query, cb) -> lastName == null ? null : cb.like(root.get("customer").get("lastName"), "%" + lastName + "%");
    }

    public static Specification<Portfolio> hasCurrencyCode(String currencyCode) {
        return (root, query, cb) -> currencyCode == null ? null : cb.equal(root.get("currencyCode"), currencyCode);
    }

    public static Specification<Portfolio> hasAmount(BigDecimal amount) {
        return (root, query, cb) -> amount == null ? null : cb.equal(root.get("amount"), amount);
    }

}
