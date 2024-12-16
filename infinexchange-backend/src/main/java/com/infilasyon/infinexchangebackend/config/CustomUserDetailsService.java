package com.infilasyon.infinexchangebackend.config;

import com.infilasyon.infinexchangebackend.entity.User;
import com.infilasyon.infinexchangebackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    UserRepository userRepository;


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> findByUsername = userRepository.findByUsername(username);

        if (findByUsername.isEmpty()) {
            throw new UsernameNotFoundException("No user found with the given user name");
        }

        return new CustomUserDetails(findByUsername.get());
    }
}
