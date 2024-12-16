package com.infilasyon.infinexchangebackend.repository;

import com.infilasyon.infinexchangebackend.entity.CurrencyTransaction;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CurrencyTransactionRepository extends JpaRepository<CurrencyTransaction, Integer> {
    List<CurrencyTransaction> findCurrencyTransactionsByUserId(Integer userId);

    List<CurrencyTransaction> findAll(Specification<CurrencyTransaction> specification);
}
