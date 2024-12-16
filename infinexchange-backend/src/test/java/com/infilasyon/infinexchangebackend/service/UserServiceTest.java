package com.infilasyon.infinexchangebackend.service;

import com.infilasyon.infinexchangebackend.dto.request.UserRequest;
import com.infilasyon.infinexchangebackend.dto.request.UserUpdateRequest;
import com.infilasyon.infinexchangebackend.dto.response.UserResponse;
import com.infilasyon.infinexchangebackend.entity.User;
import com.infilasyon.infinexchangebackend.entity.enums.Role;
import com.infilasyon.infinexchangebackend.exception.NotUniqueUsernameException;
import com.infilasyon.infinexchangebackend.exception.UserNotFoundException;
import com.infilasyon.infinexchangebackend.repository.RefreshTokenRepository;
import com.infilasyon.infinexchangebackend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Date;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @InjectMocks
    private UserService userService;

    private User user;
    private UserRequest userRequest;
    private UserUpdateRequest userUpdateRequest;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        user = new User();
        user.setId(1);
        user.setUsername("testuser");
        user.setFirstName("Test");
        user.setLastName("User");
        user.setEmail("test@example.com");
        user.setPassword("password");
        user.setRole(Role.USER);
        user.setCreatedDate(new Date());

        userRequest = new UserRequest();
        userRequest.setUsername("testuser");
        userRequest.setFirstName("Test");
        userRequest.setLastName("User");
        userRequest.setEmail("test@example.com");
        userRequest.setPassword("password");
        userRequest.setRole(Role.USER);

        userUpdateRequest= new UserUpdateRequest();
        userUpdateRequest.setUsername("testuser");
        userUpdateRequest.setFirstName("Test");
        userUpdateRequest.setLastName("User");
        userUpdateRequest.setEmail("test@example.com");
        userUpdateRequest.setRole(Role.USER);

    }

    @Test
    void testCreateUserSuccess() {
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);

        UserResponse response = userService.createUser(userRequest);

        assertNotNull(response);
        assertEquals("testuser", response.getUsername());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testCreateUserUsernameNotUnique() {
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(user));

        assertThrows(NotUniqueUsernameException.class, () -> userService.createUser(userRequest));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testUpdateUserSuccess() {
        when(userRepository.findById(anyInt())).thenReturn(Optional.of(user));
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(user));
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);

        UserResponse response = userService.updateUser(1, userUpdateRequest);

        assertNotNull(response);
        assertEquals("testuser", response.getUsername());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testUpdateUserNotFound() {
        when(userRepository.findById(anyInt())).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> userService.updateUser(1, userUpdateRequest));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testDeleteUserSuccess() {
        doNothing().when(refreshTokenRepository).deleteByUserId(anyInt());
        doNothing().when(userRepository).deleteById(anyInt());

        userService.deleteUser(1);

        verify(refreshTokenRepository, times(1)).deleteByUserId(anyInt());
        verify(userRepository, times(1)).deleteById(anyInt());
    }

}
