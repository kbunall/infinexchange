package com.infilasyon.infinexchangebackend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.infilasyon.infinexchangebackend.dto.request.UserRequest;
import com.infilasyon.infinexchangebackend.dto.request.UserUpdateRequest;
import com.infilasyon.infinexchangebackend.dto.response.UserResponse;
import com.infilasyon.infinexchangebackend.entity.enums.Role;
import com.infilasyon.infinexchangebackend.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;

import static org.mockito.ArgumentMatchers.anyInt;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import static org.hamcrest.CoreMatchers.is;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testGetAllUsersShouldReturn200OK() throws Exception {
        UserResponse userResponse = new UserResponse();
        userResponse.setId(1);
        userResponse.setUsername("testuser");

        when(userService.getAllUsers()).thenReturn(Arrays.asList(userResponse));

        mockMvc.perform(get("/api/v1/users")
                        .with(jwt().authorities(new SimpleGrantedAuthority("ADMIN"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id", is(userResponse.getId())))
                .andExpect(jsonPath("$[0].username", is(userResponse.getUsername())))
                .andDo(print());
        verify(userService).getAllUsers();
    }
    @Test
    void testGetAllUsersShouldReturn403ForbiddenForNonAdmin() throws Exception {
        UserResponse userResponse = new UserResponse();
        userResponse.setId(1);
        userResponse.setUsername("testuser");

        when(userService.getAllUsers()).thenReturn(Arrays.asList(userResponse));

        mockMvc.perform(get("/api/v1/users")
                        .with(jwt().authorities(new SimpleGrantedAuthority("USER"))))
                .andExpect(status().isForbidden())
                .andDo(print());

    }
    @Test
    void testSearchUsersShouldReturn200OK() throws Exception {
        UserResponse userResponse = new UserResponse();
        userResponse.setId(1);
        userResponse.setUsername("testuser");

        when(userService.findUsersByCriteria(any(), any(), any(), any(), any(), any(), any(), any()))
                .thenReturn(Arrays.asList(userResponse));

        mockMvc.perform(get("/api/v1/users/search")
                        .param("username", "testuser")
                        .with(jwt().authorities(new SimpleGrantedAuthority("ADMIN"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id", is(userResponse.getId())))
                .andExpect(jsonPath("$[0].username", is(userResponse.getUsername())))
                .andDo(print());
        verify(userService).findUsersByCriteria(any(), any(), any(), any(), any(), any(), any(), any());
    }
    @Test
    void testSearchUsersShouldReturn403ForbiddenForNonAdmin() throws Exception {
        UserResponse userResponse = new UserResponse();
        userResponse.setId(1);
        userResponse.setUsername("testuser");

        when(userService.findUsersByCriteria(any(), any(), any(), any(), any(), any(), any(), any()))
                .thenReturn(Arrays.asList(userResponse));

        mockMvc.perform(get("/api/v1/users/search")
                        .param("username", "testuser")
                        .with(jwt().authorities(new SimpleGrantedAuthority("USER"))))
                .andExpect(status().isForbidden())
                .andDo(print());
    }

    @Test
    void testGetUserByIdShouldReturn200OK() throws Exception {
        int userId = 1;

        UserResponse userResponse = new UserResponse();
        userResponse.setId(userId);
        userResponse.setUsername("testuser");

        when(userService.getUserById(userId)).thenReturn(userResponse);

        mockMvc.perform(get("/api/v1/users/{id}", userId)
                        .with(jwt().authorities(new SimpleGrantedAuthority("ADMIN"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(userResponse.getId())))
                .andExpect(jsonPath("$.username", is(userResponse.getUsername())))
                .andDo(print());

        verify(userService).getUserById(userId);
    }

    @Test
    void testCreateUserShouldReturn200OK() throws Exception {
        UserRequest userRequest = new UserRequest();
        userRequest.setUsername("newuser");
        userRequest.setPassword("Asdf123*");
        userRequest.setFirstName("user");
        userRequest.setLastName("user");
        userRequest.setEmail("email@gmail.com");
        userRequest.setRole(Role.USER);

        UserResponse userResponse = new UserResponse();
        userResponse.setId(1);
        userResponse.setUsername(userRequest.getUsername());
        userResponse.setFirstName(userRequest.getFirstName());
        userResponse.setLastName(userRequest.getLastName());
        userResponse.setEmail(userRequest.getEmail());
        userResponse.setRole(userRequest.getRole());

        when(userService.createUser(any(UserRequest.class))).thenReturn(userResponse);

        mockMvc.perform(post("/api/v1/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userRequest))
                        .with(jwt().authorities(new SimpleGrantedAuthority("ADMIN"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(userResponse.getId())))
                .andExpect(jsonPath("$.username", is(userResponse.getUsername())))
                .andDo(print());

        verify(userService).createUser(any(UserRequest.class));
    }
    @Test
    void testUpdateUserShouldReturn200OK() throws Exception {
        int userId = 1;
        UserRequest userRequest = new UserRequest();
        userRequest.setUsername("updateduser");
        userRequest.setPassword("NewPassword1@");
        userRequest.setFirstName("John");
        userRequest.setLastName("Doe");
        userRequest.setRole(Role.USER);
        userRequest.setEmail("updateduser@example.com");

        UserResponse userResponse = new UserResponse();
        userResponse.setId(userId);
        userResponse.setUsername(userRequest.getUsername());

        when(userService.updateUser(anyInt(), any(UserUpdateRequest.class))).thenReturn(userResponse);

        mockMvc.perform(put("/api/v1/users/{id}", userId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userRequest))
                        .with(jwt().authorities(new SimpleGrantedAuthority("ADMIN"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(userResponse.getId())))
                .andExpect(jsonPath("$.username", is(userResponse.getUsername())))
                .andDo(print());

        verify(userService).updateUser(anyInt(), any(UserUpdateRequest.class));
    }
    @Test
    void testDeleteUserShouldReturn204NoContent() throws Exception {
        int userId = 1;

        mockMvc.perform(delete("/api/v1/users/{id}", userId)
                        .with(jwt().authorities(new SimpleGrantedAuthority("ADMIN"))))
                .andExpect(status().isNoContent())
                .andDo(print());

        verify(userService).deleteUser(userId);
    }

}
