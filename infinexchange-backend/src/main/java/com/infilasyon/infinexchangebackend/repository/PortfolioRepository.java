package com.infilasyon.infinexchangebackend.repository;

import com.infilasyon.infinexchangebackend.entity.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface PortfolioRepository extends JpaRepository<Portfolio, Integer>, JpaSpecificationExecutor<Portfolio> {
    Optional<Portfolio> findByCustomerIdAndCurrencyCode(Integer customerId, String currencyCode);
    List<Portfolio> findByCustomerId(Integer customerId);
}
