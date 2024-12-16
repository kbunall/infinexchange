package com.infilasyon.infinexchangebackend.service;

import com.infilasyon.infinexchangebackend.dto.request.ChangePasswordRequest;
import com.infilasyon.infinexchangebackend.dto.request.UserRequest;
import com.infilasyon.infinexchangebackend.dto.request.UserUpdateRequest;
import com.infilasyon.infinexchangebackend.dto.response.UserResponse;
import com.infilasyon.infinexchangebackend.entity.User;
import com.infilasyon.infinexchangebackend.exception.IncorrectOldPasswordException;
import com.infilasyon.infinexchangebackend.exception.NewPasswordSameAsOldException;
import com.infilasyon.infinexchangebackend.exception.NotUniqueUsernameException;
import com.infilasyon.infinexchangebackend.exception.UserNotFoundException;
import com.infilasyon.infinexchangebackend.repository.RefreshTokenRepository;
import com.infilasyon.infinexchangebackend.repository.UserRepository;
import com.infilasyon.infinexchangebackend.repository.specifications.UserSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenRepository refreshTokenRepository;
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public UserResponse getUserById(Integer id) {
        User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User not found with the given id: " + id));
        return convertToResponse(user);
    }

    public List<UserResponse> findUsersByCriteria(Integer id, String username, String firstName, String lastName,
                                                  String role, String email, Date createdDateStart, Date createdDateEnd) {

        Specification<User> specification = Specification.where(null);

        if (id != null) {
            specification = specification.and(UserSpecifications.byId(id));
        }
        if (username != null) {
            specification = specification.and(UserSpecifications.byUsername(username));
        }
        if (firstName != null) {
            specification = specification.and(UserSpecifications.byFirstName(firstName));
        }
        if (lastName != null) {
            specification = specification.and(UserSpecifications.byLastName(lastName));
        }
        if (role != null) {
            specification = specification.and(UserSpecifications.byRole(role));
        }
        if (email != null) {
            specification = specification.and(UserSpecifications.byEmail(email));
        }
        if (createdDateStart != null || createdDateEnd != null) {
            specification = specification.and(UserSpecifications.byCreatedDateBetween(createdDateStart, createdDateEnd));
        }

        List<User> users = userRepository.findAll(specification);

        return users.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }


    public UserResponse createUser(UserRequest userRequest) {
        String usernameInRequest = userRequest.getUsername();
        if (userRepository.findByUsername(usernameInRequest).isPresent()) {
            throw new NotUniqueUsernameException("This username is already taken: " + usernameInRequest);
        }
        User user = convertToEntity(userRequest);
        User savedUser = userRepository.save(user);
        return convertToResponse(savedUser);
    }

    public UserResponse updateUser(Integer id, UserUpdateRequest userUpdateRequest) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with the given id: " + id));

        String usernameInRequest = userUpdateRequest.getUsername();
        Optional<User> byUsername = userRepository.findByUsername(usernameInRequest);

        if (byUsername.isPresent() && !byUsername.get().equals(user) ) {
            throw new NotUniqueUsernameException("This username has already taken: " + usernameInRequest);
        }
        user.setUsername(usernameInRequest);
        user.setFirstName(userUpdateRequest.getFirstName());
        user.setLastName(userUpdateRequest.getLastName());

        user.setRole(userUpdateRequest.getRole());
        user.setEmail(userUpdateRequest.getEmail());
        User updatedUser = userRepository.save(user);
        return convertToResponse(updatedUser);
    }

    @Transactional
    public void deleteUser(Integer id) {
        refreshTokenRepository.deleteByUserId(id);
        userRepository.deleteById(id);
    }

    public void changePassword(Integer id, ChangePasswordRequest changePasswordRequest) {
        User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User not found with the given id: " + id));
        if (!passwordEncoder.matches(changePasswordRequest.getOldPassword(), user.getPassword())) {
            throw new IncorrectOldPasswordException("Mevcut sifrenizi dogru girmediniz. Lutfen kontrol edin ve tekrar girin.");
        }
        if (passwordEncoder.matches(changePasswordRequest.getNewPassword(), user.getPassword())) {
            throw new NewPasswordSameAsOldException("Yeni sifreniz eskisiyle ayni olamaz.");
        }
        user.setPassword(passwordEncoder.encode(changePasswordRequest.getNewPassword()));
        userRepository.save(user);
    }

    private User convertToEntity(UserRequest userRequest) {
        User user = new User();
        user.setUsername(userRequest.getUsername());
        String encodedPassword = passwordEncoder.encode(userRequest.getPassword());
        user.setPassword(encodedPassword);
        user.setFirstName(userRequest.getFirstName());
        user.setLastName(userRequest.getLastName());
        user.setCreatedDate(new Date());
        user.setRole(userRequest.getRole());
        user.setEmail(userRequest.getEmail());
        return user;
    }

    private UserResponse convertToResponse(User user) {
        UserResponse userResponse = new UserResponse();
        userResponse.setId(user.getId());
        userResponse.setUsername(user.getUsername());
        userResponse.setFirstName(user.getFirstName());
        userResponse.setLastName(user.getLastName());
        userResponse.setCreatedDate(user.getCreatedDate());
        userResponse.setRole(user.getRole());
        userResponse.setEmail(user.getEmail());
        return userResponse;
    }
}