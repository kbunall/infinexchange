package com.infilasyon.infinexchangebackend.controller.docs;
import com.infilasyon.infinexchangebackend.dto.request.UserRequest;
import com.infilasyon.infinexchangebackend.dto.request.UserUpdateRequest;
import com.infilasyon.infinexchangebackend.dto.response.UserResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;

import java.util.List;

@Tag(name = "User Controller", description = "Operations pertaining to users in InfinExchange system")
public interface IUserController {

    @Operation(summary = "Get All Users", description = "Retrieve a list of all users", security = @SecurityRequirement(name = "bearerAuth"))
    ResponseEntity<List<UserResponse>> getAllUsers();

    @Operation(summary = "Get User by ID", description = "Retrieve a specific user by ID", security = @SecurityRequirement(name = "bearerAuth"))
    ResponseEntity<UserResponse> getUserById(Integer id);

    @Operation(summary = "Create User", description = "Create a new user", security = @SecurityRequirement(name = "bearerAuth"))
    ResponseEntity<UserResponse> createUser(@Valid UserRequest userRequest);

    @Operation(summary = "Update User", description = "Update an existing user", security = @SecurityRequirement(name = "bearerAuth"))
    ResponseEntity<UserResponse> updateUser(Integer id, @Valid UserUpdateRequest userUpdateRequest);

    @Operation(summary = "Delete User", description = "Delete a specific user", security = @SecurityRequirement(name = "bearerAuth"))
    ResponseEntity<Void> deleteUser(Integer id);
}