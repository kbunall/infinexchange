package com.infilasyon.infinexchangebackend.service;

import com.infilasyon.infinexchangebackend.dto.request.CustomerRequest;
import com.infilasyon.infinexchangebackend.dto.request.CustomerUpdateRequest;
import com.infilasyon.infinexchangebackend.dto.response.CustomerProfileResponse;
import com.infilasyon.infinexchangebackend.dto.response.CustomerResponse;
import com.infilasyon.infinexchangebackend.entity.Customer;
import com.infilasyon.infinexchangebackend.entity.User;
import com.infilasyon.infinexchangebackend.entity.enums.CustomerType;
import com.infilasyon.infinexchangebackend.entity.enums.Role;
import com.infilasyon.infinexchangebackend.exception.CustomerNotFoundException;
import com.infilasyon.infinexchangebackend.exception.InvalidTCNumberException;
import com.infilasyon.infinexchangebackend.repository.CustomerRepository;
import com.infilasyon.infinexchangebackend.utils.SecurityUtils;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.math.BigDecimal;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CustomerServiceTest {

    @Mock
    private CustomerRepository customerRepository;
    @Mock
    private SecurityUtils securityUtils;
    @InjectMocks
    private CustomerService customerService;

    @Test
    public void testCreateCustomer_ShouldCreateCustomer_WhenValidRequest() {
        CustomerRequest customerRequest = new CustomerRequest();
        customerRequest.setType("B");
        customerRequest.setTcNo("18794831090");
        customerRequest.setEmail("email@example.com");
        customerRequest.setBalance(BigDecimal.valueOf(200));

        User authenticatedUser = new User();
        authenticatedUser.setId(1);
        authenticatedUser.setRole(Role.USER);

        Customer newCustomer = new Customer();
        newCustomer.setId(1);
        newCustomer.setType(CustomerType.B);
        newCustomer.setTcNo("18794831090");
        newCustomer.setEmail("valid.email@example.com");
        newCustomer.setBalance(BigDecimal.valueOf(200));
        newCustomer.setUser(authenticatedUser);

        CustomerResponse expectedResponse = new CustomerResponse();
        expectedResponse.setId(newCustomer.getId());
        expectedResponse.setType(newCustomer.getType());
        expectedResponse.setTcNo(newCustomer.getTcNo());
        expectedResponse.setEmail(newCustomer.getEmail());
        expectedResponse.setBalance(newCustomer.getBalance());

        when(securityUtils.getAuthenticatedUser()).thenReturn(authenticatedUser);
        when(customerRepository.save(any(Customer.class))).thenReturn(newCustomer);

        CustomerResponse result = customerService.createCustomer(customerRequest);

        assertNotNull(result);
        assertEquals(expectedResponse.getId(), result.getId());
        assertEquals(expectedResponse.getType(), result.getType());
        assertEquals(expectedResponse.getTcNo(), result.getTcNo());
        assertEquals(expectedResponse.getEmail(), result.getEmail());
        assertEquals(expectedResponse.getBalance(), result.getBalance());

        verify(customerRepository, times(1)).save(any(Customer.class));
        verify(securityUtils, times(1)).getAuthenticatedUser();
    }
    @Test
    public void testCreateCustomer_ShouldThrowInvalidTCNumberException_WhenCustomerTypeBAndInvalidTCNo() {
        CustomerRequest customerRequest = new CustomerRequest();
        customerRequest.setType("B");
        customerRequest.setTcNo("12345678901"); // Geçersiz TC No
        customerRequest.setEmail("email@email.com");
        customerRequest.setBalance(BigDecimal.valueOf(200));

        InvalidTCNumberException exception = assertThrows(InvalidTCNumberException.class, () -> {
            customerService.createCustomer(customerRequest);
        });

        assertEquals("Bireysel müşteriler için geçerli bir TC Kimlik No gereklidir.", exception.getMessage());

        verify(customerRepository, never()).save(any(Customer.class));
    }

    @Test
    public void testGetCustomersByUserRole_ShouldReturnAllCustomers_WhenUserIsAdmin() {
        User adminUser = new User();
        adminUser.setId(1);
        adminUser.setRole(Role.ADMIN);

        when(securityUtils.getAuthenticatedUser()).thenReturn(adminUser);

        Customer customer1 = new Customer();
        customer1.setId(1);
        customer1.setUser(new User());
        Customer customer2 = new Customer();
        customer2.setId(2);
        customer2.setUser(new User());

        List<Customer> customers = Arrays.asList(customer1, customer2);
        when(customerRepository.findAll()).thenReturn(customers);

        List<CustomerResponse> result = customerService.getCustomersByUserRole();

        assertEquals(2, result.size());
        verify(customerRepository, times(1)).findAll();
        verify(customerRepository, never()).findCustomersByUserId(anyInt());
    }

    @Test
    public void testGetCustomersByUserRole_ShouldReturnOwnCustomers_WhenUserIsUserRole() {
        User user = new User();
        user.setId(2);
        user.setRole(Role.USER);

        when(securityUtils.getAuthenticatedUser()).thenReturn(user);

        Customer customer1 = new Customer();
        customer1.setId(1);
        customer1.setUser(user);
        Customer customer2 = new Customer();
        customer2.setId(2);
        customer2.setUser(user);

        List<Customer> userCustomers = Arrays.asList(customer1, customer2);
        when(customerRepository.findCustomersByUserId(user.getId())).thenReturn(userCustomers);

        List<CustomerResponse> result = customerService.getCustomersByUserRole();

        assertEquals(2, result.size());
        verify(customerRepository, times(1)).findCustomersByUserId(user.getId());
        verify(customerRepository, never()).findAll();
    }
    @Test
    public void testGetCustomerById_ShouldThrowAccessDeniedException_WhenUserTriesToAccessOtherUserCustomer() {
        User user = new User();
        user.setId(2);
        user.setRole(Role.USER);

        User otherUser = new User();
        otherUser.setId(3);

        Customer otherCustomer = new Customer();
        otherCustomer.setId(1);
        otherCustomer.setUser(otherUser);

        when(securityUtils.getAuthenticatedUser()).thenReturn(user);
        when(customerRepository.findById(otherCustomer.getId())).thenReturn(Optional.of(otherCustomer));

        assertThrows(AccessDeniedException.class, () -> customerService.getCustomerById(otherCustomer.getId()));

        verify(customerRepository, times(1)).findById(otherCustomer.getId());
        verify(securityUtils, times(1)).getAuthenticatedUser();
    }
    @Test
    public void testGetCustomerById_ShouldReturnCustomer_WhenUserAccessesOwnCustomer() {
        User user = new User();
        user.setId(2);
        user.setRole(Role.USER);

        Customer ownCustomer = new Customer();
        ownCustomer.setId(1);
        ownCustomer.setUser(user);
        ownCustomer.setPortfolio(new ArrayList<>());
        ownCustomer.setAccountTransactions(new ArrayList<>());
        ownCustomer.setCurrencyTransactions(new ArrayList<>());

        when(securityUtils.getAuthenticatedUser()).thenReturn(user);
        when(customerRepository.findById(ownCustomer.getId())).thenReturn(Optional.of(ownCustomer));

        CustomerProfileResponse result = customerService.getCustomerById(ownCustomer.getId());

        assertEquals(ownCustomer.getId(), result.getCustomerResponse().getId());

        verify(customerRepository, times(1)).findById(ownCustomer.getId());
        verify(securityUtils, times(1)).getAuthenticatedUser();
    }

    @Test
    public void testUpdateCustomer_ShouldUpdateCustomerAndReturnUpdatedResponse() {
        User authenticatedUser = new User();
        authenticatedUser.setId(1);
        authenticatedUser.setRole(Role.ADMIN);

        Customer existingCustomer = new Customer();
        existingCustomer.setId(1);
        existingCustomer.setFirstName("John");
        existingCustomer.setLastName("Doe");
        existingCustomer.setType(CustomerType.B);
        existingCustomer.setTcNo("18794831090");
        existingCustomer.setDateOfBirth(new Date());
        existingCustomer.setPhoneNumber("5558888888");
        existingCustomer.setAddress("123 Main St");
        existingCustomer.setEmail("john.doe@example.com");
        existingCustomer.setBalance(BigDecimal.valueOf(1000));
        existingCustomer.setUser(authenticatedUser);

        CustomerUpdateRequest customerUpdateRequest = new CustomerUpdateRequest();
        customerUpdateRequest.setFirstName("Jane");
        customerUpdateRequest.setLastName("Smith");
        customerUpdateRequest.setType("B");
        customerUpdateRequest.setTcNo("18794831090");
        customerUpdateRequest.setDateOfBirth(new Date());
        customerUpdateRequest.setPhoneNumber("555999999678");
        customerUpdateRequest.setAddress("456 Elm St");
        customerUpdateRequest.setEmail("jane.smith@example.com");

        Customer updatedCustomer = new Customer();
        updatedCustomer.setId(1);
        updatedCustomer.setFirstName("Jane");
        updatedCustomer.setLastName("Smith");
        updatedCustomer.setType(CustomerType.B);
        updatedCustomer.setTcNo("18794831090");
        updatedCustomer.setDateOfBirth(new Date());
        updatedCustomer.setPhoneNumber("555999999678");
        updatedCustomer.setAddress("456 Elm St");
        updatedCustomer.setEmail("jane.smith@example.com");
        updatedCustomer.setBalance(BigDecimal.valueOf(2000));
        updatedCustomer.setUser(authenticatedUser);

        when(securityUtils.getAuthenticatedUser()).thenReturn(authenticatedUser);
        when(customerRepository.findById(anyInt())).thenReturn(java.util.Optional.of(existingCustomer));
        when(customerRepository.save(any(Customer.class))).thenReturn(updatedCustomer);

        CustomerResponse result = customerService.updateCustomer(1, customerUpdateRequest);

        assertNotNull(result);
        assertEquals("Jane", result.getFirstName());
        assertEquals("Smith", result.getLastName());
        assertEquals(CustomerType.B, result.getType());
        assertEquals("18794831090", result.getTcNo());
        assertEquals("555999999678", result.getPhoneNumber());
        assertEquals("456 Elm St", result.getAddress());
        assertEquals("jane.smith@example.com", result.getEmail());
        assertEquals(BigDecimal.valueOf(2000), result.getBalance());

        verify(securityUtils, times(1)).getAuthenticatedUser();
        verify(customerRepository, times(1)).findById(1);
        verify(customerRepository, times(1)).save(any(Customer.class));
    }

    @Test
    public void testUpdateCustomer_ShouldThrowAccessDeniedException_WhenUserTriesToUpdateAnotherUserCustomer() {
        User authenticatedUser = new User();
        authenticatedUser.setId(2);
        authenticatedUser.setRole(Role.USER);

        Customer existingCustomer = new Customer();
        existingCustomer.setId(1);
        existingCustomer.setUser(new User()); // Different user

        CustomerUpdateRequest customerUpdateRequest = new CustomerUpdateRequest();
        customerUpdateRequest.setFirstName("Jane");

        when(securityUtils.getAuthenticatedUser()).thenReturn(authenticatedUser);
        when(customerRepository.findById(anyInt())).thenReturn(java.util.Optional.of(existingCustomer));

        assertThrows(AccessDeniedException.class, () -> {
            customerService.updateCustomer(1, customerUpdateRequest);
        });

        verify(securityUtils, times(1)).getAuthenticatedUser();
        verify(customerRepository, times(1)).findById(1);
        verify(customerRepository, never()).save(any(Customer.class));
    }
    @Test
    public void testDeleteCustomer_ShouldDeleteCustomer_WhenCustomerExistsAndUserIsAdmin() {
        User authenticatedUser = new User();
        authenticatedUser.setId(1);
        authenticatedUser.setRole(Role.ADMIN);

        Customer existingCustomer = new Customer();
        existingCustomer.setId(1);
        existingCustomer.setUser(authenticatedUser);

        when(securityUtils.getAuthenticatedUser()).thenReturn(authenticatedUser);
        when(customerRepository.findById(anyInt())).thenReturn(java.util.Optional.of(existingCustomer));

        customerService.deleteCustomer(1);

        verify(customerRepository, times(1)).deleteById(1);
    }

    @Test
    public void testDeleteCustomer_ShouldThrowAccessDeniedException_WhenUserTriesToDeleteAnotherUserCustomer() {
        User authenticatedUser = new User();
        authenticatedUser.setId(2);
        authenticatedUser.setRole(Role.USER);

        Customer existingCustomer = new Customer();
        existingCustomer.setId(1);
        existingCustomer.setUser(new User()); // Different user

        when(securityUtils.getAuthenticatedUser()).thenReturn(authenticatedUser);
        when(customerRepository.findById(anyInt())).thenReturn(java.util.Optional.of(existingCustomer));

        assertThrows(AccessDeniedException.class, () -> {
            customerService.deleteCustomer(1);
        });

        verify(securityUtils, times(1)).getAuthenticatedUser();
        verify(customerRepository, times(1)).findById(1);
        verify(customerRepository, never()).deleteById(anyInt());
    }

    @Test
    public void testDeleteCustomer_ShouldThrowCustomerNotFoundException_WhenCustomerDoesNotExist() {
        User authenticatedUser = new User();
        authenticatedUser.setId(1);
        authenticatedUser.setRole(Role.ADMIN);

        when(customerRepository.findById(anyInt())).thenReturn(java.util.Optional.empty());

        assertThrows(CustomerNotFoundException.class, () -> {
            customerService.deleteCustomer(1);
        });

        verify(customerRepository, times(1)).findById(1);
        verify(customerRepository, never()).deleteById(anyInt());
    }
}
