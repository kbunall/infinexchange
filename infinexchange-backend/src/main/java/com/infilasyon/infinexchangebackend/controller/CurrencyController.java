package com.infilasyon.infinexchangebackend.controller;

import com.infilasyon.infinexchangebackend.controller.docs.ICurrencyController;
import com.infilasyon.infinexchangebackend.entity.Currency;
import com.infilasyon.infinexchangebackend.service.CurrencyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/currencies")
@RequiredArgsConstructor
public class CurrencyController implements ICurrencyController {

    private final CurrencyService currencyService;

    @GetMapping
    public List<Currency> getAllCurrencies() {
        return currencyService.getAllCurrencies();
    }

    @GetMapping("/{code}")
    public ResponseEntity<Currency> getCurrencyByCode(@PathVariable String code) {
        Optional<Currency> optionalCurrency = currencyService.getCurrencyByCode(code);
        return optionalCurrency.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Currency createCurrency(@RequestBody Currency currency) {
        return currencyService.saveCurrency(currency);
    }

    @PutMapping("/{code}")
    public ResponseEntity<Currency> updateCurrency(@PathVariable String code, @RequestParam BigDecimal buying, @RequestParam BigDecimal selling) {
        try {
            Currency updatedCurrency = currencyService.updateCurrency(code, buying, selling);
            return ResponseEntity.ok(updatedCurrency);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{code}")
    public ResponseEntity<Void> deleteCurrency(@PathVariable String code) {
        try {
            currencyService.deleteCurrency(code);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

}
