package com.infilasyon.infinexchangebackend.repository;

import com.infilasyon.infinexchangebackend.entity.AccountTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface AccountTransactionRepository extends JpaRepository<AccountTransaction, Integer>, JpaSpecificationExecutor<AccountTransaction> {
    List<AccountTransaction> findAccountTransactionsByUserId(Integer userId);
}