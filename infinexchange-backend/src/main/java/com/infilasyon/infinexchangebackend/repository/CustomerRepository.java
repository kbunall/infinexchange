package com.infilasyon.infinexchangebackend.repository;

import com.infilasyon.infinexchangebackend.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer>, JpaSpecificationExecutor<Customer> {
    List<Customer> findCustomersByUserId(Integer userId);
    boolean existsByTaxNo(String taxNo);
    boolean existsByCorporationName(String corporationName);
    boolean existsByPhoneNumber(String phoneNumber);
    boolean existsByEmail(String email);
    boolean existsByTcNo(String tcNo);
}
