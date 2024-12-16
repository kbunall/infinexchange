package com.infilasyon.infinexchangebackend.controller.docs;
import com.infilasyon.infinexchangebackend.dto.request.CustomerRequest;
import com.infilasyon.infinexchangebackend.dto.request.CustomerUpdateRequest;
import com.infilasyon.infinexchangebackend.dto.response.CustomerProfileResponse;
import com.infilasyon.infinexchangebackend.dto.response.CustomerResponse;
import com.infilasyon.infinexchangebackend.dto.response.PortfolioResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;

import java.util.List;

@Tag(name = "Customer Controller", description = "Operations pertaining to customers in InfinExchange system")
public interface ICustomerController {

    @Operation(summary = "Create Customer", description = "Create a new customer", security = @SecurityRequirement(name = "bearerAuth"))
    ResponseEntity<CustomerResponse> createCustomer(@Valid CustomerRequest customerRequest);

    @Operation(summary = "Get All Customers", description = "Retrieve a list of all customers", security = @SecurityRequirement(name = "bearerAuth"))
    ResponseEntity<List<CustomerResponse>> getAllCustomers();

    @Operation(summary = "Get Customer by ID", description = "Retrieve a specific customer by ID", security = @SecurityRequirement(name = "bearerAuth"))
    ResponseEntity<CustomerProfileResponse> getCustomerById(Integer id);

    @Operation(summary = "Update Customer", description = "Update an existing customer", security = @SecurityRequirement(name = "bearerAuth"))
    ResponseEntity<CustomerResponse> updateCustomer(Integer id,@Valid CustomerUpdateRequest customerUpdateRequest);

    @Operation(summary = "Delete Customer", description = "Delete a specific customer", security = @SecurityRequirement(name = "bearerAuth"))
    ResponseEntity<Void> deleteCustomer(Integer id);

    @Operation(summary = "Get Customer Portfolio", description = "Retrieve the portfolio of a specific customer by ID", security = @SecurityRequirement(name = "bearerAuth"))
    ResponseEntity<List<PortfolioResponse>> getPortfolio(Integer id);
}