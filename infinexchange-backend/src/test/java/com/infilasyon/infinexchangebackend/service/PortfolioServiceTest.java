package com.infilasyon.infinexchangebackend.service;

import com.infilasyon.infinexchangebackend.dto.response.PortfolioDetailsResponse;
import com.infilasyon.infinexchangebackend.dto.response.PortfolioResponse;
import com.infilasyon.infinexchangebackend.entity.Customer;
import com.infilasyon.infinexchangebackend.entity.Portfolio;
import com.infilasyon.infinexchangebackend.entity.User;
import com.infilasyon.infinexchangebackend.entity.enums.Role;
import com.infilasyon.infinexchangebackend.exception.CustomerNotFoundException;
import com.infilasyon.infinexchangebackend.repository.CustomerRepository;
import com.infilasyon.infinexchangebackend.repository.PortfolioRepository;
import com.infilasyon.infinexchangebackend.utils.SecurityUtils;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
@ExtendWith(MockitoExtension.class)
public class PortfolioServiceTest {
    @Mock
    private PortfolioRepository portfolioRepository;
    @Mock
    private CustomerRepository customerRepository;
    @Mock
    private SecurityUtils securityUtils;
    @InjectMocks
    private PortfolioService portfolioService;
    @Test
    void shouldReturnAllPortfoliosForAdmin() {
        User adminUser = new User();
        adminUser.setId(1);
        adminUser.setRole(Role.ADMIN);

        Portfolio portfolio1 = new Portfolio();
        portfolio1.setId(1);
        portfolio1.setCustomer(new Customer());

        Portfolio portfolio2 = new Portfolio();
        portfolio2.setId(2);
        portfolio2.setCustomer(new Customer());

        when(securityUtils.getAuthenticatedUser()).thenReturn(adminUser);
        when(portfolioRepository.findAll(any(Specification.class))).thenReturn(List.of(portfolio1, portfolio2));

        List<PortfolioDetailsResponse> result = portfolioService.getAll(null,null,null,null,null,null,null);

        assertEquals(2, result.size());
        verify(portfolioRepository).findAll(any(Specification.class));
    }

    @Test
    void shouldReturnOwnCustomersPortfoliosForUser() {
        User user = new User();
        user.setId(1);
        user.setRole(Role.USER);

        Portfolio portfolio1 = new Portfolio();
        portfolio1.setId(1);
        portfolio1.setCustomer(new Customer());

        Portfolio portfolio2 = new Portfolio();
        portfolio2.setId(2);
        portfolio2.setCustomer(new Customer());

        when(securityUtils.getAuthenticatedUser()).thenReturn(user);
        when(portfolioRepository.findAll(any(Specification.class))).thenReturn(List.of(portfolio1, portfolio2));

        List<PortfolioDetailsResponse> result = portfolioService.getAll(null,null,null,null,null,null,null);

        assertEquals(2, result.size());
        verify(portfolioRepository).findAll(any(Specification.class));
    }

    @Test
    void shouldReturnPortfoliosForExistingCustomer() {
        Integer customerId = 1;
        Portfolio portfolio1 = new Portfolio();
        portfolio1.setCurrencyCode("USD");
        portfolio1.setAmount(BigDecimal.valueOf(1000));

        Portfolio portfolio2 = new Portfolio();
        portfolio2.setCurrencyCode("EUR");
        portfolio2.setAmount(BigDecimal.valueOf(500));

        when(customerRepository.findById(customerId)).thenReturn(Optional.of(new Customer()));
        when(portfolioRepository.findByCustomerId(customerId)).thenReturn(List.of(portfolio1, portfolio2));

        List<PortfolioResponse> responseList = portfolioService.getPortfolioByCustomerId(customerId);

        assertEquals(2, responseList.size());

        PortfolioResponse response1 = responseList.get(0);
        assertEquals("USD", response1.getCurrencyCode());
        assertEquals(BigDecimal.valueOf(1000), response1.getAmount());

        PortfolioResponse response2 = responseList.get(1);
        assertEquals("EUR", response2.getCurrencyCode());
        assertEquals(BigDecimal.valueOf(500), response2.getAmount());
    }
    @Test
    void shouldThrowExceptionIfCustomerNotFound() {
        Integer customerId = 1;
        when(customerRepository.findById(customerId)).thenReturn(Optional.empty());

        Exception exception = assertThrows(CustomerNotFoundException.class, () ->
                portfolioService.getPortfolioByCustomerId(customerId)
        );

        assertEquals("Customer not found with the given id: " + customerId, exception.getMessage());
    }

}
