package com.infilasyon.infinexchangebackend.service;

import com.infilasyon.infinexchangebackend.entity.Currency;
import com.infilasyon.infinexchangebackend.exception.CurrencyAlreadyExistException;
import com.infilasyon.infinexchangebackend.exception.CurrencyNotFoundException;
import com.infilasyon.infinexchangebackend.repository.CurrencyRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CurrencyServiceTest {

    @Mock
    private CurrencyRepository currencyRepository;

    @InjectMocks
    private CurrencyService currencyService;

    private Currency currency;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        currency = new Currency();
        currency.setCode("USD");
        currency.setBuying(BigDecimal.valueOf(8.50));
        currency.setSelling(BigDecimal.valueOf(8.75));
        currency.setUpdatedDate(new Date());
    }

    @Test
    void testGetAllCurrencies() {
        List<Currency> currencies = Arrays.asList(currency);
        when(currencyRepository.findAll()).thenReturn(currencies);

        List<Currency> result = currencyService.getAllCurrencies();

        assertEquals(1, result.size());
        verify(currencyRepository, times(1)).findAll();
    }

    @Test
    void testGetCurrencyByCodeFound() {
        when(currencyRepository.findByCode("USD")).thenReturn(Optional.of(currency));

        Optional<Currency> result = currencyService.getCurrencyByCode("USD");

        assertTrue(result.isPresent());
        assertEquals("USD", result.get().getCode());
        verify(currencyRepository, times(1)).findByCode("USD");
    }

    @Test
    void testGetCurrencyByCodeNotFound() {
        when(currencyRepository.findByCode("USD")).thenReturn(Optional.empty());

        Optional<Currency> result = currencyService.getCurrencyByCode("USD");

        assertFalse(result.isPresent());
        verify(currencyRepository, times(1)).findByCode("USD");
    }

    @Test
    void testSaveCurrencySuccess() {
        when(currencyRepository.findByCode("USD")).thenReturn(Optional.empty());
        when(currencyRepository.save(any(Currency.class))).thenReturn(currency);

        Currency savedCurrency = currencyService.saveCurrency(currency);

        assertNotNull(savedCurrency);
        assertEquals("USD", savedCurrency.getCode());
        verify(currencyRepository, times(1)).findByCode("USD");
        verify(currencyRepository, times(1)).save(any(Currency.class));
    }

    @Test
    void testSaveCurrencyAlreadyExists() {
        when(currencyRepository.findByCode("USD")).thenReturn(Optional.of(currency));

        assertThrows(CurrencyAlreadyExistException.class, () -> currencyService.saveCurrency(currency));
        verify(currencyRepository, times(1)).findByCode("USD");
        verify(currencyRepository, never()).save(any(Currency.class));
    }

    @Test
    void testUpdateCurrencySuccess() {
        when(currencyRepository.findByCode("USD")).thenReturn(Optional.of(currency));
        when(currencyRepository.save(any(Currency.class))).thenReturn(currency);

        Currency updatedCurrency = currencyService.updateCurrency("USD", BigDecimal.valueOf(8.60), BigDecimal.valueOf(8.85));

        assertNotNull(updatedCurrency);
        assertEquals(BigDecimal.valueOf(8.60), updatedCurrency.getBuying());
        assertEquals(BigDecimal.valueOf(8.85), updatedCurrency.getSelling());
        verify(currencyRepository, times(1)).findByCode("USD");
        verify(currencyRepository, times(1)).save(any(Currency.class));
    }

    @Test
    void testUpdateCurrencyNotFound() {
        when(currencyRepository.findByCode("USD")).thenReturn(Optional.empty());

        assertThrows(CurrencyNotFoundException.class, () -> currencyService.updateCurrency("USD", BigDecimal.valueOf(8.60), BigDecimal.valueOf(8.85)));
        verify(currencyRepository, times(1)).findByCode("USD");
        verify(currencyRepository, never()).save(any(Currency.class));
    }

    @Test
    void testDeleteCurrencySuccess() {
        when(currencyRepository.findByCode("USD")).thenReturn(Optional.of(currency));

        currencyService.deleteCurrency("USD");

        verify(currencyRepository, times(1)).findByCode("USD");
        verify(currencyRepository, times(1)).delete(currency);
    }

    @Test
    void testDeleteCurrencyNotFound() {
        when(currencyRepository.findByCode("USD")).thenReturn(Optional.empty());

        currencyService.deleteCurrency("USD");

        verify(currencyRepository, times(1)).findByCode("USD");
        verify(currencyRepository, never()).delete(any(Currency.class));
    }
}
