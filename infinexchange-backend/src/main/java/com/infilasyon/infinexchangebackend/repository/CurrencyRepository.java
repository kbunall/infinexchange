package com.infilasyon.infinexchangebackend.repository;
import com.infilasyon.infinexchangebackend.entity.Currency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CurrencyRepository extends JpaRepository<Currency, Long> {
    public Optional<Currency> findByCode(String code);

}
