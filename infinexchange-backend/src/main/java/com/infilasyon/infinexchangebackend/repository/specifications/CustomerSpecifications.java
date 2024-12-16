package com.infilasyon.infinexchangebackend.repository.specifications;
import com.infilasyon.infinexchangebackend.entity.Customer;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.Date;

public class CustomerSpecifications {

    public static Specification<Customer> hasFirstName(String firstName) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("firstName"), firstName);
    }

    public static Specification<Customer> hasLastName(String lastName) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("lastName"), lastName);
    }

    public static Specification<Customer> hasCorporationName(String corporationName) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("corporationName"), corporationName);
    }

    public static Specification<Customer> hasType(String type) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("type"), type);
    }

    public static Specification<Customer> hasTcNo(String tcNo) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("tcNo"), tcNo);
    }

    public static Specification<Customer> hasTaxNo(String taxNo) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("taxNo"), taxNo);
    }

    public static Specification<Customer> hasDateOfBirth(Date dateOfBirth) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("dateOfBirth"), dateOfBirth);
    }

    public static Specification<Customer> hasPhoneNumber(String phoneNumber) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("phoneNumber"), phoneNumber);
    }

    public static Specification<Customer> hasAddress(String address) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("address"), address);
    }

    public static Specification<Customer> hasEmail(String email) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("email"), email);
    }

    public static Specification<Customer> hasBalance(BigDecimal balance) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("balance"), balance);
    }

    public static Specification<Customer> hasCreatedDate(Date createdDate) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("createdDate"), createdDate);
    }

    public static Specification<Customer> hasUserId(Integer userId) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("user").get("id"), userId);
    }

    public static Specification<Customer> hasId(Integer id) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("id"), id);
    }
}