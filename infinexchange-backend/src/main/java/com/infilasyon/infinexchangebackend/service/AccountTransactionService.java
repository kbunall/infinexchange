package com.infilasyon.infinexchangebackend.service;

import com.infilasyon.infinexchangebackend.dto.request.DepositRequest;
import com.infilasyon.infinexchangebackend.dto.request.WithdrawalRequest;
import com.infilasyon.infinexchangebackend.dto.response.AccountTransactionResponse;
import com.infilasyon.infinexchangebackend.entity.AccountTransaction;
import com.infilasyon.infinexchangebackend.entity.enums.AccountTransactionType;
import com.infilasyon.infinexchangebackend.entity.Customer;
import com.infilasyon.infinexchangebackend.entity.User;
import com.infilasyon.infinexchangebackend.entity.enums.Role;
import com.infilasyon.infinexchangebackend.exception.CustomerNotFoundException;
import com.infilasyon.infinexchangebackend.exception.InsufficientBalanceException;
import com.infilasyon.infinexchangebackend.repository.AccountTransactionRepository;
import com.infilasyon.infinexchangebackend.repository.CustomerRepository;
import com.infilasyon.infinexchangebackend.repository.specifications.AccountTransactionSpecifications;
import com.infilasyon.infinexchangebackend.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountTransactionService {
    private final CustomerRepository customerRepository;
    private final AccountTransactionRepository accountTransactionRepository;
    private final SecurityUtils securityUtils;

    @Transactional
    public void deposit(DepositRequest depositRequest) {
        processTransaction(depositRequest.getCustomerId(), depositRequest.getAmount(), AccountTransactionType.DEPOSIT);
    }

    @Transactional
    public void withdraw(WithdrawalRequest withdrawalRequest) {
        processTransaction(withdrawalRequest.getCustomerId(), withdrawalRequest.getAmount().negate(), AccountTransactionType.WITHDRAWAL);
    }

    public List<AccountTransactionResponse> findTransactionsByCriteria(Integer customerId, Integer userId,
                                                                       AccountTransactionType transactionType,
                                                                       BigDecimal minAmount, BigDecimal maxAmount,
                                                                       LocalDateTime startDate, LocalDateTime endDate,
                                                                       String customerFirstName, String customerLastName,
                                                                       String tcNo, String corporationName, String taxNo) {

        User authenticatedUser = securityUtils.getAuthenticatedUser();

        Specification<AccountTransaction> specification = Specification.where(null);

        if (customerId != null) {
            specification = specification.and(AccountTransactionSpecifications.hasCustomerId(customerId));
        }
        if (userId != null) {
            specification = specification.and(AccountTransactionSpecifications.hasUserId(userId));
        }
        if (transactionType != null) {
            specification = specification.and(AccountTransactionSpecifications.hasTransactionType(transactionType));
        }
        if (minAmount != null) {
            specification = specification.and(AccountTransactionSpecifications.hasMinAmount(minAmount));
        }
        if (maxAmount != null) {
            specification = specification.and(AccountTransactionSpecifications.hasMaxAmount(maxAmount));
        }
        if (startDate != null) {
            specification = specification.and(AccountTransactionSpecifications.hasStartDate(startDate));
        }
        if (endDate != null) {
            specification = specification.and(AccountTransactionSpecifications.hasEndDate(endDate));
        }
        if (customerFirstName != null) {
            specification = specification.and(AccountTransactionSpecifications.hasCustomerFirstName(customerFirstName));
        }
        if (customerLastName != null) {
            specification = specification.and(AccountTransactionSpecifications.hasCustomerLastName(customerLastName));
        }
        if (tcNo != null) {
            specification = specification.and(AccountTransactionSpecifications.hasTcNo(tcNo));
        }
        if (corporationName != null) {
            specification = specification.and(AccountTransactionSpecifications.hasCorporationName(corporationName));
        }
        if (taxNo != null) {
            specification = specification.and(AccountTransactionSpecifications.hasTaxNo(taxNo));
        }

        if (!Role.ADMIN.equals(authenticatedUser.getRole())) {
            specification = specification.and(AccountTransactionSpecifications.hasUserId(authenticatedUser.getId()));
        }

        return accountTransactionRepository.findAll(specification)
                .stream()
                .map(this::toAccountTransactionResponse)
                .collect(Collectors.toList());
    }

    public List<AccountTransactionResponse> getAllTransactionsByUserRole() {
        User user = securityUtils.getAuthenticatedUser();
        Role role = user.getRole();
        Integer userId = user.getId();

        if (Role.ADMIN.equals(role)) {
            return getAllTransactions();
        } else {
            return getAllTransactionsByUserId(userId);
        }
    }

    public List<AccountTransactionResponse> getAllTransactions() {
        return accountTransactionRepository.findAll().stream()
                .map(this::toAccountTransactionResponse)
                .collect(Collectors.toList());
    }

    public List<AccountTransactionResponse> getAllTransactionsByUserId(Integer userId) {
        return accountTransactionRepository.findAccountTransactionsByUserId(userId).stream()
                .map(this::toAccountTransactionResponse)
                .collect(Collectors.toList());
    }

    private void processTransaction(Integer customerId, BigDecimal amount, AccountTransactionType transactionType) {
        Customer customer = findCustomerById(customerId);
        User authenticatedUser = securityUtils.getAuthenticatedUser();
        checkAccess(customer, authenticatedUser);

        if (transactionType == AccountTransactionType.WITHDRAWAL) {
            validateSufficientBalance(customer, amount.negate());
        }

        updateCustomerBalance(customer, amount);
        recordTransaction(authenticatedUser, customer, transactionType, amount);
    }

    private Customer findCustomerById(Integer customerId) {
        return customerRepository.findById(customerId)
                .orElseThrow(() -> new CustomerNotFoundException("Customer not found with the given id: " + customerId));
    }

    private void checkAccess(Customer customer, User authenticatedUser) {
        if (!(Role.ADMIN.equals(authenticatedUser.getRole())) && !customer.getUser().equals(authenticatedUser)) {
            throw new AccessDeniedException("You do not have the required permissions to access this resource.");
        }
    }

    private void validateSufficientBalance(Customer customer, BigDecimal amount) {
        if (customer.getBalance().compareTo(amount) < 0) {
            throw new InsufficientBalanceException("Insufficient balance.");
        }
    }

    private void updateCustomerBalance(Customer customer, BigDecimal amount) {
        customer.setBalance(customer.getBalance().add(amount));
        customerRepository.save(customer);
    }

    private void recordTransaction(User authenticatedUser, Customer customer, AccountTransactionType type, BigDecimal amount) {
        AccountTransaction transaction = new AccountTransaction();
        transaction.setUser(authenticatedUser);
        transaction.setCustomer(customer);
        transaction.setAccountTransactionType(type);
        transaction.setAmount(amount);
        transaction.setTransactionDate(LocalDateTime.now());

        accountTransactionRepository.save(transaction);
    }

    private AccountTransactionResponse toAccountTransactionResponse(AccountTransaction transaction) {
        AccountTransactionResponse response = new AccountTransactionResponse();
        response.setId(transaction.getId());
        response.setCustomerId(transaction.getCustomer().getId());
        response.setUserId(transaction.getUser().getId());
        response.setUserFirstName(transaction.getUser().getFirstName());
        response.setUserLastName(transaction.getUser().getLastName());
        response.setTcNo(transaction.getCustomer().getTcNo());
        response.setTaxNo(transaction.getCustomer().getTaxNo());
        response.setCustomerFirstName(transaction.getCustomer().getFirstName());
        response.setCustomerLastName(transaction.getCustomer().getLastName());
        response.setCorporationName(transaction.getCustomer().getCorporationName());
        response.setAccountTransactionType(transaction.getAccountTransactionType());
        response.setAmount(transaction.getAmount());
        response.setTransactionDate(transaction.getTransactionDate());
        return response;
    }

}