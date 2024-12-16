package com.infilasyon.infinexchangebackend.service;

import com.infilasyon.infinexchangebackend.entity.Currency;
import com.infilasyon.infinexchangebackend.exception.CurrencyAlreadyExistException;
import com.infilasyon.infinexchangebackend.exception.CurrencyNotFoundException;
import com.infilasyon.infinexchangebackend.repository.CurrencyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CurrencyService {


    private final CurrencyRepository currencyRepository;

    public List<Currency> getAllCurrencies() {
        return currencyRepository.findAll();
    }

    public Optional<Currency> getCurrencyByCode(String code) {
        return currencyRepository.findByCode(code);
    }

    public Currency saveCurrency(Currency currency) {
        String currencyCode = currency.getCode();
        Optional<Currency> currencyFound = currencyRepository.findByCode(currencyCode);
        if (currencyFound.isPresent()) {
            throw new CurrencyAlreadyExistException("This currency already exists: " + currencyCode);
        }
        currency.setUpdatedDate(new Date());
        return currencyRepository.save(currency);
    }
    public Currency updateCurrency(String code, BigDecimal buying, BigDecimal selling) {
        Currency currency = currencyRepository.findByCode(code)
                .orElseThrow(() -> new CurrencyNotFoundException("Currency not found with code: " + code));

        BigDecimal previousSelling = currency.getSelling();

        // 4 haneli olacak şekilde buying ve selling değerlerini ayarlama
        buying = buying.setScale(4, RoundingMode.HALF_UP);
        selling = selling.setScale(4, RoundingMode.HALF_UP);

        currency.setBuying(buying);
        currency.setSelling(selling);
        currency.setUpdatedDate(new Date());

        if (previousSelling != null && previousSelling.compareTo(BigDecimal.ZERO) != 0) {
            BigDecimal changePercentage = selling.subtract(previousSelling)
                    .divide(previousSelling, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .setScale(4, RoundingMode.HALF_UP);

            currency.setPriceChangePercentage(changePercentage);
        } else {
            currency.setPriceChangePercentage(BigDecimal.ZERO.setScale(4, RoundingMode.HALF_UP));
        }

        return currencyRepository.save(currency);
    }

    public void deleteCurrency(String code) {
        Optional<Currency> optionalCurrency = currencyRepository.findByCode(code);
        optionalCurrency.ifPresent(currencyRepository::delete);
    }
}
