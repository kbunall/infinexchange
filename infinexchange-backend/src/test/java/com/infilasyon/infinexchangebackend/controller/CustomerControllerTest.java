package com.infilasyon.infinexchangebackend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.infilasyon.infinexchangebackend.dto.request.CustomerRequest;
import com.infilasyon.infinexchangebackend.dto.request.CustomerUpdateRequest;
import com.infilasyon.infinexchangebackend.dto.response.*;
import com.infilasyon.infinexchangebackend.entity.User;
import com.infilasyon.infinexchangebackend.entity.enums.CustomerType;
import com.infilasyon.infinexchangebackend.entity.enums.Role;
import com.infilasyon.infinexchangebackend.service.CustomerService;
import com.infilasyon.infinexchangebackend.utils.SecurityUtils;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Date;

import static org.hamcrest.CoreMatchers.is;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class CustomerControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CustomerService customerService;

    @MockBean
    private SecurityUtils securityUtils;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testCreateCustomerShouldReturn201Created() throws Exception {
        CustomerRequest customerRequest = new CustomerRequest();
        customerRequest.setFirstName("John");
        customerRequest.setLastName("Doe");
        customerRequest.setType("B");
        customerRequest.setTcNo("12345678901");
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date dateOfBirth = sdf.parse("1999-01-01");
        customerRequest.setDateOfBirth(dateOfBirth);
        customerRequest.setPhoneNumber("5555454555");
        customerRequest.setAddress("123 Main St");
        customerRequest.setEmail("john.doe@example.com");
        customerRequest.setBalance(BigDecimal.valueOf(100));

        CustomerResponse customerResponse = new CustomerResponse();
        customerResponse.setId(1);
        customerResponse.setFirstName(customerRequest.getFirstName());
        customerResponse.setLastName(customerRequest.getLastName());
        customerResponse.setCorporationName(customerRequest.getCorporationName());
        customerResponse.setType(CustomerType.valueOf(customerRequest.getType()));
        customerResponse.setTcNo(customerRequest.getTcNo());
        customerResponse.setTaxNo(customerRequest.getTaxNo());
        customerResponse.setDateOfBirth(customerRequest.getDateOfBirth());
        customerResponse.setPhoneNumber(customerRequest.getPhoneNumber());
        customerResponse.setAddress(customerRequest.getAddress());
        customerResponse.setEmail(customerRequest.getEmail());
        customerResponse.setBalance(customerRequest.getBalance());

        User user = new User();
        user.setRole(Role.USER);
        user.setId(1);

        when(customerService.createCustomer(any(CustomerRequest.class))).thenReturn(customerResponse);
        when(securityUtils.getAuthenticatedUser()).thenReturn(user);

        mockMvc.perform(post("/api/v1/customers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(customerRequest))
                        .with(jwt().authorities(new SimpleGrantedAuthority("USER"))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(customerResponse.getId())))
                .andExpect(jsonPath("$.firstName", is(customerResponse.getFirstName())))
                .andExpect(jsonPath("$.lastName", is(customerResponse.getLastName())))
                .andExpect(jsonPath("$.corporationName", is(customerResponse.getCorporationName())))
                .andExpect(jsonPath("$.type", is(customerResponse.getType().toString())))
                .andExpect(jsonPath("$.tcNo", is(customerResponse.getTcNo())))
                .andExpect(jsonPath("$.taxNo", is(customerResponse.getTaxNo())))
                .andExpect(jsonPath("$.phoneNumber", is(customerResponse.getPhoneNumber())))
                .andExpect(jsonPath("$.address", is(customerResponse.getAddress())))
                .andExpect(jsonPath("$.email", is(customerResponse.getEmail())))
                .andDo(print());
        verify(customerService).createCustomer(any(CustomerRequest.class));
    }
    @Test
    void testCreateCustomerShouldReturn400BadRequestWhenDataIsInvalid() throws Exception {
        CustomerRequest customerRequest = new CustomerRequest();
        customerRequest.setFirstName("");
        customerRequest.setLastName("Doe");
        customerRequest.setType("INVALID_TYPE");
        customerRequest.setTcNo("123");
        customerRequest.setPhoneNumber("555");
        customerRequest.setBalance(BigDecimal.valueOf(-100));

        User user = new User();
        user.setRole(Role.USER);
        user.setId(1);

        when(securityUtils.getAuthenticatedUser()).thenReturn(user);

        mockMvc.perform(post("/api/v1/customers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(customerRequest))
                        .with(jwt().authorities(new SimpleGrantedAuthority("USER"))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.type", is("Tip değeri bireysel müşteriler icin 'B', kurumsal müşteriler icin 'K' olmalıdır.")))
                .andExpect(jsonPath("$.errors.phoneNumber", is("Geçersiz telefon numarası formatı. + ve 10-15 rakam içermelidir.")))
                .andDo(print());
    }

    @Test
    void testCreateCustomerShouldReturn403ForbiddenWhenUserIsUnauthorized() throws Exception {
        CustomerRequest customerRequest = new CustomerRequest();
        customerRequest.setFirstName("John");
        customerRequest.setLastName("Doe");
        customerRequest.setType("B");
        customerRequest.setTcNo("12345678901");
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date dateOfBirth = sdf.parse("1999-01-01");
        customerRequest.setDateOfBirth(dateOfBirth);
        customerRequest.setPhoneNumber("5555454555");
        customerRequest.setAddress("123 Main St");
        customerRequest.setEmail("john.doe@example.com");
        customerRequest.setBalance(BigDecimal.valueOf(100));

        mockMvc.perform(post("/api/v1/customers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(customerRequest)))
                .andExpect(status().isUnauthorized())
                .andDo(print());
    }

    @Test
    void testGetCustomerByIdShouldReturn200OK() throws Exception {
        int customerId = 1;

        CustomerResponse customerResponse = new CustomerResponse();
        customerResponse.setId(customerId);
        customerResponse.setFirstName("John");
        customerResponse.setLastName("Doe");

        PortfolioResponse portfolioResponse = new PortfolioResponse();
        portfolioResponse.setAmount(BigDecimal.valueOf(1000));

        AccountTransactionResponse accountTransactionResponse = new AccountTransactionResponse();
        accountTransactionResponse.setId(1);
        accountTransactionResponse.setCustomerId(customerId);

        CurrencyTransactionResponse currencyTransactionResponse = new CurrencyTransactionResponse();
        currencyTransactionResponse.setId(1);
        currencyTransactionResponse.setCustomerId(customerId);

        CustomerProfileResponse customerProfileResponse = new CustomerProfileResponse();
        customerProfileResponse.setCustomerResponse(customerResponse);
        customerProfileResponse.getPortfolio().add(portfolioResponse);
        customerProfileResponse.getAccountTransactions().add(accountTransactionResponse);
        customerProfileResponse.getCurrencyTransactions().add(currencyTransactionResponse);

        when(customerService.getCustomerById(customerId)).thenReturn(customerProfileResponse);

        mockMvc.perform(get("/api/v1/customers/{id}", customerId)
                        .with(jwt().authorities(new SimpleGrantedAuthority("USER")))
                         .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.customerResponse.id", is(customerResponse.getId())))
                .andExpect(jsonPath("$.customerResponse.firstName", is(customerResponse.getFirstName())))
                .andExpect(jsonPath("$.customerResponse.lastName", is(customerResponse.getLastName())))
                .andExpect(jsonPath("$.accountTransactions[0].id", is(accountTransactionResponse.getId())))
                .andExpect(jsonPath("$.currencyTransactions[0].id", is(currencyTransactionResponse.getId())))
                .andDo(print());

        verify(customerService).getCustomerById(customerId);
    }

    @Test
    void testUpdateCustomerShouldReturnUpdatedCustomer() throws Exception {
        int customerId = 1;

        CustomerUpdateRequest customerUpdateRequest = new CustomerUpdateRequest();
        customerUpdateRequest.setFirstName("Jane");
        customerUpdateRequest.setLastName("Doe");
        customerUpdateRequest.setType("B");
        customerUpdateRequest.setTcNo("98765432101");
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date dateOfBirth = sdf.parse("1985-02-10");
        customerUpdateRequest.setDateOfBirth(dateOfBirth);
        customerUpdateRequest.setPhoneNumber("5551234567");
        customerUpdateRequest.setAddress("456 Another St");
        customerUpdateRequest.setEmail("jane.doe@example.com");

        CustomerResponse customerResponse = new CustomerResponse();
        customerResponse.setId(customerId);
        customerResponse.setFirstName(customerUpdateRequest.getFirstName());
        customerResponse.setLastName(customerUpdateRequest.getLastName());
        customerResponse.setCorporationName(customerUpdateRequest.getCorporationName());
        customerResponse.setType(CustomerType.valueOf(customerUpdateRequest.getType()));
        customerResponse.setTcNo(customerUpdateRequest.getTcNo());
        customerResponse.setTaxNo(customerUpdateRequest.getTaxNo());
        customerResponse.setDateOfBirth(customerUpdateRequest.getDateOfBirth());
        customerResponse.setPhoneNumber(customerUpdateRequest.getPhoneNumber());
        customerResponse.setAddress(customerUpdateRequest.getAddress());
        customerResponse.setEmail(customerUpdateRequest.getEmail());

        when(customerService.updateCustomer(any(Integer.class), any(CustomerUpdateRequest.class))).thenReturn(customerResponse);

        mockMvc.perform(put("/api/v1/customers/{id}", customerId)
                        .with(jwt().authorities(new SimpleGrantedAuthority("USER")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(customerUpdateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(customerResponse.getId())))
                .andExpect(jsonPath("$.firstName", is(customerResponse.getFirstName())))
                .andExpect(jsonPath("$.lastName", is(customerResponse.getLastName())))
                .andExpect(jsonPath("$.corporationName", is(customerResponse.getCorporationName())))
                .andExpect(jsonPath("$.type", is(customerResponse.getType().toString())))
                .andExpect(jsonPath("$.tcNo", is(customerResponse.getTcNo())))
                .andExpect(jsonPath("$.taxNo", is(customerResponse.getTaxNo())))
                .andExpect(jsonPath("$.phoneNumber", is(customerResponse.getPhoneNumber())))
                .andExpect(jsonPath("$.address", is(customerResponse.getAddress())))
                .andExpect(jsonPath("$.email", is(customerResponse.getEmail())))
                .andDo(print());

        verify(customerService).updateCustomer(any(Integer.class), any(CustomerUpdateRequest.class));
    }

    @Test
    void testDeleteCustomerShouldReturnNoContent() throws Exception {
        int customerId = 1;

        mockMvc.perform(delete("/api/v1/customers/{id}", customerId)
                                .with(jwt().authorities(new SimpleGrantedAuthority("USER"))))
                .andExpect(status().isNoContent())
                .andDo(print());

        verify(customerService).deleteCustomer(customerId);
    }

}
