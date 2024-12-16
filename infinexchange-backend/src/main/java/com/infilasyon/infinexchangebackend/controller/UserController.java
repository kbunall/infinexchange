package com.infilasyon.infinexchangebackend.controller;

import com.infilasyon.infinexchangebackend.controller.docs.IUserController;
import com.infilasyon.infinexchangebackend.dto.request.ChangePasswordRequest;
import com.infilasyon.infinexchangebackend.dto.request.UserRequest;
import com.infilasyon.infinexchangebackend.dto.request.UserUpdateRequest;
import com.infilasyon.infinexchangebackend.dto.response.UserResponse;
import com.infilasyon.infinexchangebackend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Validated
public class UserController implements IUserController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize(("hasAuthority('ADMIN')"))
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/search")
    @PreAuthorize(("hasAuthority('ADMIN')"))
    public ResponseEntity<List<UserResponse>> searchUsers(
            @RequestParam(required = false) Integer id,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String firstName,
            @RequestParam(required = false) String lastName,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) Date createdDateStart,
            @RequestParam(required = false) Date createdDateEnd) {

        List<UserResponse> users = userService.findUsersByCriteria(id, username, firstName, lastName, role, email, createdDateStart, createdDateEnd);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or #id == authentication.principal.user.id")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Integer id) {
        UserResponse user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }


    @PostMapping
    @PreAuthorize(("hasAuthority('ADMIN')"))
    public ResponseEntity<UserResponse> createUser(@RequestBody @Valid UserRequest userRequest) {
        return ResponseEntity.ok(userService.createUser(userRequest));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or #id == authentication.principal.user.id")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Integer id, @RequestBody @Valid UserUpdateRequest userUpdateRequest) {
        UserResponse updatedUser = userService.updateUser(id, userUpdateRequest);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize(("hasAuthority('ADMIN')"))
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }


    @PostMapping("/change-password/{id}")
    @PreAuthorize("#id == authentication.principal.user.id")
    public ResponseEntity<String> changePassword(
            @PathVariable Integer id,
            @RequestBody @Valid ChangePasswordRequest changePasswordRequest) {
            userService.changePassword(id, changePasswordRequest);
            return ResponseEntity.ok("Password changed successfully");
    }

}