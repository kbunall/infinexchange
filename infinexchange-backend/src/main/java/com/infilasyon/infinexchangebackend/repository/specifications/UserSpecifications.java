package com.infilasyon.infinexchangebackend.repository.specifications;

import com.infilasyon.infinexchangebackend.entity.User;
import org.springframework.data.jpa.domain.Specification;

import java.util.Date;

public class UserSpecifications {

    public static Specification<User> byId(Integer id) {
        return (root, query, criteriaBuilder) ->
                id == null ? criteriaBuilder.conjunction() : criteriaBuilder.equal(root.get("id"), id);
    }

    public static Specification<User> byUsername(String username) {
        return (root, query, criteriaBuilder) ->
                username == null ? criteriaBuilder.conjunction() : criteriaBuilder.like(root.get("username"), "%" + username + "%");
    }

    public static Specification<User> byFirstName(String firstName) {
        return (root, query, criteriaBuilder) ->
                firstName == null ? criteriaBuilder.conjunction() : criteriaBuilder.like(root.get("firstName"), "%" + firstName + "%");
    }

    public static Specification<User> byLastName(String lastName) {
        return (root, query, criteriaBuilder) ->
                lastName == null ? criteriaBuilder.conjunction() : criteriaBuilder.like(root.get("lastName"), "%" + lastName + "%");
    }

    public static Specification<User> byRole(String role) {
        return (root, query, criteriaBuilder) ->
                role == null ? criteriaBuilder.conjunction() : criteriaBuilder.equal(root.get("role"), role);
    }

    public static Specification<User> byEmail(String email) {
        return (root, query, criteriaBuilder) ->
                email == null ? criteriaBuilder.conjunction() : criteriaBuilder.like(root.get("email"), "%" + email + "%");
    }

    public static Specification<User> byCreatedDateBetween(Date startDate, Date endDate) {
        return (root, query, criteriaBuilder) ->
                (startDate == null && endDate == null) ? criteriaBuilder.conjunction() :
                        (startDate != null && endDate != null) ? criteriaBuilder.between(root.get("createdDate"), startDate, endDate) :
                                (startDate != null) ? criteriaBuilder.greaterThanOrEqualTo(root.get("createdDate"), startDate) :
                                        criteriaBuilder.lessThanOrEqualTo(root.get("createdDate"), endDate);
    }
}