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
import com.infilasyon.infinexchangebackend.utils.SecurityUtils;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
@ExtendWith(MockitoExtension.class)
public class AccountTransactionServiceTest {
    @Mock
    private CustomerRepository customerRepository;
    @Mock
    private AccountTransactionRepository accountTransactionRepository;
    @Mock
    private SecurityUtils securityUtils;
    @InjectMocks
    private AccountTransactionService accountTransactionService;

    @Test
    void shouldDepositSuccessfully() {
        DepositRequest depositRequest = new DepositRequest();
        depositRequest.setCustomerId(1);
        depositRequest.setAmount(BigDecimal.valueOf(1000));

        User user = new User();
        user.setId(1);
        user.setRole(Role.USER);

        Customer customer = new Customer();
        customer.setId(1);
        customer.setBalance(BigDecimal.valueOf(5000));
        customer.setUser(user);


        when(customerRepository.findById(1)).thenReturn(Optional.of(customer));
        when(securityUtils.getAuthenticatedUser()).thenReturn(user);

        accountTransactionService.deposit(depositRequest);

        verify(customerRepository).save(customer);
        verify(accountTransactionRepository).save(any(AccountTransaction.class));
    }
    @Test
    void shouldAllowAdminToDepositForAnyCustomer() {
        DepositRequest depositRequest = new DepositRequest();
        depositRequest.setCustomerId(1);
        depositRequest.setAmount(BigDecimal.valueOf(1000));

        User user = new User();
        user.setId(1);
        user.setRole(Role.USER);

        User authenticatedUser = new User();
        authenticatedUser.setId(2);
        authenticatedUser.setRole(Role.ADMIN);

        Customer customer = new Customer();
        customer.setId(1);
        customer.setBalance(BigDecimal.valueOf(5000));
        customer.setUser(user);


        when(customerRepository.findById(1)).thenReturn(Optional.of(customer));
        when(securityUtils.getAuthenticatedUser()).thenReturn(authenticatedUser);

        accountTransactionService.deposit(depositRequest);

        verify(customerRepository).save(customer);
        verify(accountTransactionRepository).save(any(AccountTransaction.class));
    }
    @Test
    void shouldThrowCustomerNotFoundException() {
        DepositRequest depositRequest = new DepositRequest();
        depositRequest.setCustomerId(1);
        depositRequest.setAmount(BigDecimal.valueOf(1000));

        when(customerRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(CustomerNotFoundException.class, () -> accountTransactionService.deposit(depositRequest));

        verify(customerRepository, never()).save(any(Customer.class));
        verify(accountTransactionRepository, never()).save(any(AccountTransaction.class));
    }

    @Test
    void shouldThrowAccessDeniedException() {
        DepositRequest depositRequest = new DepositRequest();
        depositRequest.setCustomerId(1);
        depositRequest.setAmount(BigDecimal.valueOf(1000));

        User authenticatedUser = new User();
        authenticatedUser.setId(2);
        authenticatedUser.setRole(Role.USER);

        User user = new User();
        user.setId(1);
        user.setRole(Role.USER);

        Customer customer = new Customer();
        customer.setId(1);
        customer.setBalance(BigDecimal.valueOf(5000));
        customer.setUser(user);

        when(customerRepository.findById(1)).thenReturn(Optional.of(customer));
        when(securityUtils.getAuthenticatedUser()).thenReturn(authenticatedUser);

        assertThrows(AccessDeniedException.class, () -> accountTransactionService.deposit(depositRequest));

        verify(customerRepository, never()).save(any(Customer.class));
        verify(accountTransactionRepository, never()).save(any(AccountTransaction.class));
    }

    @Test
    void shouldWithdrawSuccessfully() {
        WithdrawalRequest withdrawalRequest = new WithdrawalRequest();
        withdrawalRequest.setCustomerId(1);
        withdrawalRequest.setAmount(BigDecimal.valueOf(1000));

        User user = new User();
        user.setId(1);
        user.setRole(Role.USER);

        Customer customer = new Customer();
        customer.setId(1);
        customer.setBalance(BigDecimal.valueOf(5000));
        customer.setUser(user);

        when(customerRepository.findById(1)).thenReturn(Optional.of(customer));
        when(securityUtils.getAuthenticatedUser()).thenReturn(user);

        accountTransactionService.withdraw(withdrawalRequest);

        verify(customerRepository).save(customer);
        verify(accountTransactionRepository).save(any(AccountTransaction.class));
    }
    @Test
    void shouldThrowInsufficientBalanceException() {
        WithdrawalRequest withdrawalRequest = new WithdrawalRequest();
        withdrawalRequest.setCustomerId(1);
        withdrawalRequest.setAmount(BigDecimal.valueOf(6000));

        User user = new User();
        user.setId(1);
        user.setRole(Role.USER);

        Customer customer = new Customer();
        customer.setId(1);
        customer.setBalance(BigDecimal.valueOf(5000));
        customer.setUser(user);

        when(customerRepository.findById(1)).thenReturn(Optional.of(customer));
        when(securityUtils.getAuthenticatedUser()).thenReturn(user);

        assertThrows(InsufficientBalanceException.class, () -> accountTransactionService.withdraw(withdrawalRequest));

        verify(customerRepository, never()).save(any(Customer.class));
        verify(accountTransactionRepository, never()).save(any(AccountTransaction.class));
    }
    @Test
    void shouldThrowAccessDeniedExceptionForWithdraw() {
        WithdrawalRequest withdrawalRequest = new WithdrawalRequest();
        withdrawalRequest.setCustomerId(1);
        withdrawalRequest.setAmount(BigDecimal.valueOf(1000));

        User authenticatedUser = new User();
        authenticatedUser.setId(2);
        authenticatedUser.setRole(Role.USER);

        User user = new User();
        user.setId(1);
        user.setRole(Role.USER);

        Customer customer = new Customer();
        customer.setId(1);
        customer.setBalance(BigDecimal.valueOf(5000));
        customer.setUser(user);

        when(customerRepository.findById(1)).thenReturn(Optional.of(customer));
        when(securityUtils.getAuthenticatedUser()).thenReturn(authenticatedUser);

        assertThrows(AccessDeniedException.class, () -> accountTransactionService.withdraw(withdrawalRequest));

        verify(customerRepository, never()).save(any(Customer.class));
        verify(accountTransactionRepository, never()).save(any(AccountTransaction.class));
    }
    @Test
    void shouldAllowAdminToWithdrawForAnyCustomer() {
        WithdrawalRequest withdrawalRequest = new WithdrawalRequest();
        withdrawalRequest.setCustomerId(1);
        withdrawalRequest.setAmount(BigDecimal.valueOf(1000));

        User user = new User();
        user.setId(1);
        user.setRole(Role.USER);

        User authenticatedUser = new User();
        authenticatedUser.setId(2);
        authenticatedUser.setRole(Role.ADMIN);

        Customer customer = new Customer();
        customer.setId(1);
        customer.setBalance(BigDecimal.valueOf(5000));
        customer.setUser(user);

        when(customerRepository.findById(1)).thenReturn(Optional.of(customer));
        when(securityUtils.getAuthenticatedUser()).thenReturn(authenticatedUser);

        accountTransactionService.withdraw(withdrawalRequest);

        verify(customerRepository).save(customer);
        verify(accountTransactionRepository).save(any(AccountTransaction.class));
    }

    @Test
    void shouldFindTransactionsByCriteria() {
        Integer customerId = 1;
        Integer userId = 2;
        AccountTransactionType transactionType = AccountTransactionType.DEPOSIT;
        BigDecimal minAmount = BigDecimal.valueOf(100);
        BigDecimal maxAmount = BigDecimal.valueOf(1000);
        LocalDateTime startDate = LocalDateTime.now().minusDays(10);
        LocalDateTime endDate = LocalDateTime.now();
        String customerFirstName = "John";
        String customerLastName = "Doe";
        String tcNo = "12345678901";

        Customer customer = new Customer();
        customer.setId(customerId);
        customer.setFirstName(customerFirstName);
        customer.setLastName(customerLastName);
        customer.setTcNo(tcNo);

        User user = new User();
        user.setId(userId);
        user.setFirstName("Jane");
        user.setLastName("Doe");

        AccountTransaction transaction = new AccountTransaction();
        transaction.setId(1);
        transaction.setCustomer(customer);
        transaction.setUser(user);
        transaction.setAccountTransactionType(transactionType);
        transaction.setAmount(BigDecimal.valueOf(500));
        transaction.setTransactionDate(LocalDateTime.now());

        when(accountTransactionRepository.findAll(any(Specification.class)))
                .thenReturn(List.of(transaction));
        when(securityUtils.getAuthenticatedUser()).thenReturn(user);

        List<AccountTransactionResponse> result = accountTransactionService.findTransactionsByCriteria(
                customerId, userId, transactionType, minAmount, maxAmount, startDate, endDate,
                customerFirstName, customerLastName, tcNo,null, null
        );

        assertEquals(1, result.size());
        AccountTransactionResponse response = result.get(0);
        assertEquals(1, response.getId());
        assertEquals(customerId, response.getCustomerId());
        assertEquals(userId, response.getUserId());
        assertEquals("Jane", response.getUserFirstName());
        assertEquals("Doe", response.getUserLastName());
        assertEquals(customerFirstName, response.getCustomerFirstName());
        assertEquals(customerLastName, response.getCustomerLastName());
        assertEquals(tcNo, response.getTcNo());
        assertEquals(transactionType, response.getAccountTransactionType());
        assertEquals(BigDecimal.valueOf(500), response.getAmount());
        assertNotNull(response.getTransactionDate());
    }

    @Test
    void shouldReturnAllTransactionsForAdmin() {
        User adminUser = new User();
        adminUser.setId(1);
        adminUser.setRole(Role.ADMIN);

        Customer customer1 = new Customer();
        customer1.setId(1);

        Customer customer2 = new Customer();
        customer2.setId(2);

        AccountTransaction transaction1 = new AccountTransaction();
        transaction1.setId(1);
        transaction1.setCustomer(customer1);
        transaction1.setUser(new User());
        transaction1.setAccountTransactionType(AccountTransactionType.DEPOSIT);
        transaction1.setAmount(BigDecimal.valueOf(500));
        transaction1.setTransactionDate(LocalDateTime.now());

        AccountTransaction transaction2 = new AccountTransaction();
        transaction2.setId(2);
        transaction2.setCustomer(customer2);
        transaction2.setUser(new User());
        transaction2.setAccountTransactionType(AccountTransactionType.WITHDRAWAL);
        transaction2.setAmount(BigDecimal.valueOf(300));
        transaction2.setTransactionDate(LocalDateTime.now());

        when(securityUtils.getAuthenticatedUser()).thenReturn(adminUser);
        when(accountTransactionRepository.findAll()).thenReturn(List.of(transaction1, transaction2));

        List<AccountTransactionResponse> result = accountTransactionService.getAllTransactionsByUserRole();

        assertEquals(2, result.size(), "Admin should see all transactions");
        assertTrue(result.stream().anyMatch(t -> t.getId().equals(transaction1.getId())), "Admin should see transaction 1");
        assertTrue(result.stream().anyMatch(t -> t.getId().equals(transaction2.getId())), "Admin should see transaction 2");
        verify(accountTransactionRepository).findAll();
        verify(accountTransactionRepository, never()).findAccountTransactionsByUserId(anyInt());
    }

    @Test
    void shouldReturnOwnTransactionsForNormalUser() {
        User normalUser = new User();
        normalUser.setId(2);
        normalUser.setRole(Role.USER);

        Customer customerOwn = new Customer();
        customerOwn.setId(1);
        customerOwn.setUser(normalUser);

        Customer customerOther = new Customer();
        customerOther.setId(3);
        customerOther.setUser(new User()); // Different user

        AccountTransaction transactionOwn = new AccountTransaction();
        transactionOwn.setId(1);
        transactionOwn.setCustomer(customerOwn);
        transactionOwn.setUser(normalUser);
        transactionOwn.setAccountTransactionType(AccountTransactionType.DEPOSIT);
        transactionOwn.setAmount(BigDecimal.valueOf(500));
        transactionOwn.setTransactionDate(LocalDateTime.now());

        AccountTransaction transactionOther = new AccountTransaction();
        transactionOther.setId(2);
        transactionOther.setCustomer(customerOther);
        transactionOther.setUser(new User()); // Different user
        transactionOther.setAccountTransactionType(AccountTransactionType.WITHDRAWAL);
        transactionOther.setAmount(BigDecimal.valueOf(300));
        transactionOther.setTransactionDate(LocalDateTime.now());

        when(securityUtils.getAuthenticatedUser()).thenReturn(normalUser);
        when(accountTransactionRepository.findAccountTransactionsByUserId(normalUser.getId()))
                .thenReturn(List.of(transactionOwn));

        List<AccountTransactionResponse> result = accountTransactionService.getAllTransactionsByUserRole();

        assertEquals(1, result.size(), "Normal user should see only their own transactions");
        assertTrue(result.stream().anyMatch(t -> t.getId().equals(transactionOwn.getId())), "Normal user should see transaction 1");
        assertTrue(result.stream().noneMatch(t -> t.getId().equals(transactionOther.getId())), "Normal user should not see transaction 2");

        verify(accountTransactionRepository).findAccountTransactionsByUserId(normalUser.getId());
        verify(accountTransactionRepository, never()).findAll();
    }

}
