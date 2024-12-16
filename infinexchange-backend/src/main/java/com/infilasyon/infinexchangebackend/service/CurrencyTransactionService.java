package com.infilasyon.infinexchangebackend.service;

import com.infilasyon.infinexchangebackend.dto.request.CurrencyTransactionRequest;
import com.infilasyon.infinexchangebackend.dto.response.CurrencyTransactionResponse;
import com.infilasyon.infinexchangebackend.entity.*;
import com.infilasyon.infinexchangebackend.entity.enums.CurrencyTransactionType;
import com.infilasyon.infinexchangebackend.entity.enums.Role;
import com.infilasyon.infinexchangebackend.exception.*;
import com.infilasyon.infinexchangebackend.repository.*;

import com.infilasyon.infinexchangebackend.repository.specifications.AccountTransactionSpecifications;
import com.infilasyon.infinexchangebackend.repository.specifications.CurrencyTransactionSpecifications;
import com.infilasyon.infinexchangebackend.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CurrencyTransactionService {
    private final CurrencyTransactionRepository currencyTransactionRepository;
    private final CustomerRepository customerRepository;
    private final PortfolioRepository portfolioRepository;
    private final CurrencyRepository currencyRepository;
    private final SecurityUtils securityUtils;

    @Transactional
    public CurrencyTransactionResponse buyCurrency(CurrencyTransactionRequest request) {
        Customer customer = findCustomerById(request.getCustomerId());
        User user = securityUtils.getAuthenticatedUser();
        checkAccess(customer, user);
        validateCurrencyCode(request.getCurrencyCode());
        validateCurrencyCode(request.getBuyCurrencyCode());

        BigDecimal amountToBuy = request.getAmount();
        BigDecimal enoufeCurrency;

        if ("TRY".equals(request.getCurrencyCode())) {
            Currency currencyToBuy = findCurrencyByCode(request.getBuyCurrencyCode());
            enoufeCurrency = amountToBuy.multiply(currencyToBuy.getSelling());

            checkSufficientBalanceToBuy(customer, enoufeCurrency);

            customer.setBalance(customer.getBalance().subtract(enoufeCurrency));
            customerRepository.save(customer);

            updatePortfolioAfterBuy(customer, request.getBuyCurrencyCode(), amountToBuy);
        } else if ("TRY".equals(request.getBuyCurrencyCode())) {
            Portfolio customerCurrencyPortfolio = findCustomerCurrency(customer.getId(), request.getCurrencyCode());
            Currency currencyToSell = findCurrencyByCode(request.getCurrencyCode());

            enoufeCurrency = amountToBuy.divide(currencyToSell.getBuying(), 2, RoundingMode.HALF_UP);

            validateSufficientCurrencyAmount(customerCurrencyPortfolio.getAmount(), enoufeCurrency);

            updatePortfolioAfterSale(customerCurrencyPortfolio, enoufeCurrency);
            customer.setBalance(customer.getBalance().add(amountToBuy));
            customerRepository.save(customer);
        } else {
            Portfolio customerCurrencyPortfolio = findCustomerCurrency(customer.getId(), request.getCurrencyCode());
            Currency currencyToSell = findCurrencyByCode(request.getCurrencyCode());
            Currency currencyToBuy = findCurrencyByCode(request.getBuyCurrencyCode());

            BigDecimal tlEquivalentOfBuyCurrency = amountToBuy.multiply(currencyToBuy.getSelling());
            enoufeCurrency = tlEquivalentOfBuyCurrency.divide(currencyToSell.getBuying(), 2, RoundingMode.HALF_UP);

            validateSufficientCurrencyAmount(customerCurrencyPortfolio.getAmount(), enoufeCurrency);

            updatePortfolioAfterSale(customerCurrencyPortfolio, enoufeCurrency);
            updatePortfolioAfterBuy(customer, request.getBuyCurrencyCode(), amountToBuy);
        }

        CurrencyTransaction transaction = createCurrencyTransaction(customer, user, request, CurrencyTransactionType.BUY, findCurrencyByCode(request.getBuyCurrencyCode()).getSelling());
        CurrencyTransaction savedTransaction = currencyTransactionRepository.save(transaction);

        return entityToDto(savedTransaction);
    }

    @Transactional
    public CurrencyTransactionResponse sellCurrency(CurrencyTransactionRequest request) {
        Customer customer = findCustomerById(request.getCustomerId());
        User user = securityUtils.getAuthenticatedUser();
        checkAccess(customer, user);
        validateCurrencyCode(request.getCurrencyCode());
        validateCurrencyCode(request.getBuyCurrencyCode());

        if ("TRY".equals(request.getCurrencyCode())) {
            BigDecimal amountToSell = request.getAmount();
            Currency currencyToBuy = findCurrencyByCode(request.getBuyCurrencyCode());

            checkSufficientBalanceToBuy(customer, amountToSell);

            customer.setBalance(customer.getBalance().subtract(amountToSell));
            BigDecimal amountInBuyCurrency = amountToSell.divide(currencyToBuy.getSelling(), 2, RoundingMode.HALF_UP);
            updatePortfolioAfterBuy(customer, request.getBuyCurrencyCode(), amountInBuyCurrency);
            customerRepository.save(customer);

        } else {
            Portfolio customerCurrencyInDB = findCustomerCurrency(customer.getId(), request.getCurrencyCode());
            Currency currencyToSell = findCurrencyByCode(request.getCurrencyCode());

            validateSufficientCurrencyAmount(customerCurrencyInDB.getAmount(), request.getAmount());

            if ("TRY".equals(request.getBuyCurrencyCode())) {
                BigDecimal amountInLocalCurrency = request.getAmount().multiply(currencyToSell.getBuying());
                customer.setBalance(customer.getBalance().add(amountInLocalCurrency));
                updatePortfolioAfterSale(customerCurrencyInDB, request.getAmount());
                customerRepository.save(customer);

            } else {
                Currency currencyToBuy = findCurrencyByCode(request.getBuyCurrencyCode());
                BigDecimal amountInLocalCurrency = request.getAmount().multiply(currencyToSell.getBuying());
                BigDecimal amountToBuy = amountInLocalCurrency.divide(currencyToBuy.getSelling(), 2, RoundingMode.HALF_UP);

                updatePortfolioAfterSale(customerCurrencyInDB, request.getAmount());
                updatePortfolioAfterBuy(customer, request.getBuyCurrencyCode(), amountToBuy);
            }
        }

        CurrencyTransaction transaction = createCurrencyTransaction(customer, user, request, CurrencyTransactionType.SELL, findCurrencyByCode(request.getCurrencyCode()).getBuying());
        CurrencyTransaction savedTransaction = currencyTransactionRepository.save(transaction);

        return entityToDto(savedTransaction);
    }

    public List<CurrencyTransactionResponse> findCurrencyTransactionsByCriteria(Integer customerId, String customerFirstName,
                                                                        String customerLastName, String customerCorporationName, Integer userId, String username,
                                                                        CurrencyTransactionType type, String currencyCode,
                                                                        BigDecimal amount, BigDecimal exchangeRate,
                                                                        LocalDateTime transactionDate, String targetCurrencyCode) {
        Specification<CurrencyTransaction> specification = Specification.where(null);
        User authenticatedUser = securityUtils.getAuthenticatedUser();

        if (customerId != null) {
            specification = specification.and(CurrencyTransactionSpecifications.hasCustomerId(customerId));
        }
        if (customerFirstName != null && !customerFirstName.isEmpty()) {
            specification = specification.and(CurrencyTransactionSpecifications.hasCustomerFirstName(customerFirstName));
        }
        if (customerLastName != null && !customerLastName.isEmpty()) {
            specification = specification.and(CurrencyTransactionSpecifications.hasCustomerLastName(customerLastName));
        }
        if (customerCorporationName != null && !customerCorporationName.isEmpty()) {
            specification = specification.and(CurrencyTransactionSpecifications.hasCorporationName(customerCorporationName));
        }
        if (userId != null) {
            specification = specification.and(CurrencyTransactionSpecifications.hasUserId(userId));
        }
        if (username != null) {
            specification = specification.and(CurrencyTransactionSpecifications.hasUserName(username));
        }
        if (type != null) {
            specification = specification.and(CurrencyTransactionSpecifications.hasCurrencyTransactionType(type));
        }
        if (currencyCode != null && !currencyCode.isEmpty()) {
            specification = specification.and(CurrencyTransactionSpecifications.hasCurrencyCode(currencyCode));
        }
        if (amount != null) {
            specification = specification.and(CurrencyTransactionSpecifications.hasAmount(amount));
        }
        if (exchangeRate != null) {
            specification = specification.and(CurrencyTransactionSpecifications.hasExchangeRate(exchangeRate));
        }
        if (transactionDate != null) {
            specification = specification.and(CurrencyTransactionSpecifications.hasTransactionDate(transactionDate));
        }
        if (targetCurrencyCode != null && !targetCurrencyCode.isEmpty()) {
            specification = specification.and(CurrencyTransactionSpecifications.hasTargetCurrencyCode(targetCurrencyCode));
        }
        if (!Role.ADMIN.equals(authenticatedUser.getRole())) {
            specification = specification.and(CurrencyTransactionSpecifications.hasUserId(authenticatedUser.getId()));
        }
        return currencyTransactionRepository.findAll(specification)
                .stream()
                .map(this::entityToDto)
                .collect(Collectors.toList());
    }

    public List<CurrencyTransactionResponse> getAllTransactionsByUserRole() {
        User user = securityUtils.getAuthenticatedUser();
        Role role = user.getRole();
        Integer userId = user.getId();

        if (Role.ADMIN.equals(role)) {
            return getAllTransactions();
        } else {
            return getAllTransactionsByUserId(userId);
        }
    }
    public List<CurrencyTransactionResponse> getAllTransactions() {
        return currencyTransactionRepository.findAll().stream()
                .map(this::entityToDto)
                .collect(Collectors.toList());
    }

    public List<CurrencyTransactionResponse> getAllTransactionsByUserId(Integer userId) {
        return currencyTransactionRepository.findCurrencyTransactionsByUserId(userId).stream()
                .map(this::entityToDto)
                .collect(Collectors.toList());
    }

    private Customer findCustomerById(Integer customerId) {
        return customerRepository.findById(customerId)
                .orElseThrow(() -> new CustomerNotFoundException("Customer not found with the given id: " + customerId));
    }

    private Currency findCurrencyByCode(String currencyCode) {
        return currencyRepository.findByCode(currencyCode)
                .orElseThrow(() -> new CurrencyNotFoundException("Currency not found with the given code: " + currencyCode));
    }

    private void validateCurrencyCode(String currencyCode) {
        findCurrencyByCode(currencyCode);
    }

    private void checkSufficientBalanceToBuy(Customer customer, BigDecimal amountInLocalCurrency) {
        if (customer.getBalance().compareTo(amountInLocalCurrency) < 0) {
            throw new InsufficientBalanceException("Insufficient balance");
        }
    }

    private void validateSufficientCurrencyAmount(BigDecimal amountInDB, BigDecimal requestedAmount) {
        if (amountInDB.compareTo(requestedAmount) < 0) {
            throw new InsufficientCurrencyAmountException(amountInDB, requestedAmount);
        }
    }
    private void checkAccess(Customer customer, User authenticatedUser) {
        if (!(Role.ADMIN.equals(authenticatedUser.getRole())) && !customer.getUser().equals(authenticatedUser)) {
            throw new AccessDeniedException("You do not have the required permissions to access this resource.");
        }
    }

    private CurrencyTransaction createCurrencyTransaction(Customer customer, User user, CurrencyTransactionRequest request, CurrencyTransactionType type, BigDecimal exchangeRate) {
        CurrencyTransaction transaction = new CurrencyTransaction();
        transaction.setCustomer(customer);
        transaction.setUser(user);
        transaction.setExchangeRate(exchangeRate);
        transaction.setTargetCurrencyCode(request.getBuyCurrencyCode());
        transaction.setCurrencyTransactionType(type);
        transaction.setCurrencyCode(request.getCurrencyCode());
        transaction.setAmount(request.getAmount());
        transaction.setTransactionDate(LocalDateTime.now());
        return transaction;
    }

    private void updatePortfolioAfterBuy(Customer customer, String currencyCode, BigDecimal amount) {
        Portfolio portfolio = portfolioRepository.findByCustomerIdAndCurrencyCode(customer.getId(), currencyCode)
                .orElseGet(() -> createNewPortfolio(customer, currencyCode));
        portfolio.setAmount(portfolio.getAmount().add(amount));
        portfolioRepository.save(portfolio);
    }

    private Portfolio createNewPortfolio(Customer customer, String currencyCode) {
        Portfolio portfolio = new Portfolio();
        portfolio.setCustomer(customer);
        portfolio.setCurrencyCode(currencyCode);
        portfolio.setAmount(BigDecimal.ZERO);
        return portfolio;
    }

    private void updatePortfolioAfterSale(Portfolio portfolio, BigDecimal amount) {
        portfolio.setAmount(portfolio.getAmount().subtract(amount));
        if (portfolio.getAmount().compareTo(BigDecimal.ZERO) == 0) {
            portfolioRepository.delete(portfolio);
        } else {
            portfolioRepository.save(portfolio);
        }
    }

    private Portfolio findCustomerCurrency(Integer customerId, String currencyCode) {
        return portfolioRepository.findByCustomerIdAndCurrencyCode(customerId, currencyCode)
                .orElseThrow(() -> new CustomerCurrencyNotFoundException(customerId, currencyCode));
    }

    private CurrencyTransactionResponse entityToDto(CurrencyTransaction transaction) {
        CurrencyTransactionResponse response = new CurrencyTransactionResponse();
        response.setUserName(transaction.getUser().getFirstName());
        response.setCustomerFirstName(transaction.getCustomer().getFirstName());
        response.setCustomerLastName(transaction.getCustomer().getLastName());
        response.setCompanyName(transaction.getCustomer().getCorporationName());
        response.setId(transaction.getId());
        response.setCustomerId(transaction.getCustomer().getId());
        response.setUserId(transaction.getUser().getId());
        response.setCurrencyTransactionType(transaction.getCurrencyTransactionType());
        response.setBuyCurrencyCode(transaction.getTargetCurrencyCode());
        response.setCurrencyCode(transaction.getCurrencyCode());
        response.setAmount(transaction.getAmount());
        response.setExchangeRate(transaction.getExchangeRate());
        response.setTransactionDate(transaction.getTransactionDate());
        return response;
    }
}
