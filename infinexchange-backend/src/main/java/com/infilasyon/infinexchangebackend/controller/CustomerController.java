package com.infilasyon.infinexchangebackend.controller;

import com.infilasyon.infinexchangebackend.controller.docs.ICustomerController;
import com.infilasyon.infinexchangebackend.dto.request.CustomerRequest;
import com.infilasyon.infinexchangebackend.dto.request.CustomerUpdateRequest;
import com.infilasyon.infinexchangebackend.dto.response.CustomerProfileResponse;
import com.infilasyon.infinexchangebackend.dto.response.PortfolioResponse;
import com.infilasyon.infinexchangebackend.dto.response.CustomerResponse;
import com.infilasyon.infinexchangebackend.service.PortfolioService;
import com.infilasyon.infinexchangebackend.service.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/v1/customers")
@Validated
@RequiredArgsConstructor
public class CustomerController implements ICustomerController {
    private final CustomerService customerService;
    private final PortfolioService portfolioService;

    @PostMapping
    public ResponseEntity<CustomerResponse> createCustomer(
            @RequestBody @Valid CustomerRequest customerRequest) {
        CustomerResponse customer = customerService.createCustomer(customerRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(customer);
    }

    @GetMapping("/search")
    public List<CustomerResponse> searchCustomers(@RequestParam(required = false) String firstName,
                                          @RequestParam(required = false) String lastName,
                                          @RequestParam(required = false) String corporationName,
                                          @RequestParam(required = false) String type,
                                          @RequestParam(required = false) String tcNo,
                                          @RequestParam(required = false) Integer id,
                                          @RequestParam(required = false) String taxNo,
                                          @RequestParam(required = false) Date dateOfBirth,
                                          @RequestParam(required = false) String phoneNumber,
                                          @RequestParam(required = false) String address,
                                          @RequestParam(required = false) String email,
                                          @RequestParam(required = false) BigDecimal balance,
                                          @RequestParam(required = false) Date createdDate,
                                          @RequestParam(required = false) Integer userId) {

        return customerService.findCustomersByCriteria(firstName, lastName, corporationName, type, tcNo, taxNo,
                dateOfBirth, phoneNumber, address, email, balance, createdDate, userId, id);
    }
    @GetMapping
    public ResponseEntity<List<CustomerResponse>> getAllCustomers() {
        List<CustomerResponse> customers = customerService.getCustomersByUserRole();
        return ResponseEntity.ok(customers);
    }


    @GetMapping("/{id}")
    public ResponseEntity<CustomerProfileResponse> getCustomerById(@PathVariable Integer id) {
        return ResponseEntity.ok(customerService.getCustomerById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerResponse> updateCustomer(
            @PathVariable Integer id, @RequestBody @Valid CustomerUpdateRequest customerUpdateRequest) {
        CustomerResponse customer = customerService.updateCustomer(id, customerUpdateRequest);
        return ResponseEntity.ok(customer);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Integer id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/portfolio")
    public ResponseEntity<List<PortfolioResponse>> getPortfolio(@PathVariable Integer id) {
        return ResponseEntity.ok(portfolioService.getPortfolioByCustomerId(id));
    }

}
