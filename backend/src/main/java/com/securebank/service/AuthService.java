package com.securebank.service;

import com.securebank.dto.AuthRequest;
import com.securebank.dto.AuthResponse;
import com.securebank.dto.RegisterRequest;
import com.securebank.model.Role;
import com.securebank.model.User;
import com.securebank.repository.UserRepository;
import com.securebank.config.DataInitializer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final DataInitializer dataInitializer;
    
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Processing registration request for username: {}", request.getUsername());
        
        try {
            // Validate input
            if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
                throw new RuntimeException("Username is required");
            }
            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                throw new RuntimeException("Password is required");
            }
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                throw new RuntimeException("Email is required");
            }
            
            // Check if username or email already exists
            if (userRepository.existsByUsername(request.getUsername())) {
                throw new RuntimeException("Username already exists");
            }
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email already exists");
            }
            
            var user = User.builder()
                    .username(request.getUsername())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .email(request.getEmail())
                    .fullName(request.getFullName())
                    .phoneNumber(request.getPhoneNumber())
                    .address(request.getAddress())
                    .role(Role.USER)
                    .build();
            
            log.info("Saving new user to database");
            user = userRepository.save(user);
            
            // Create default accounts for the new user
            log.info("Creating default accounts for user");
            dataInitializer.createDefaultAccounts(user);
            
            log.info("Generating JWT token");
            var token = jwtService.generateToken(user);
            
            log.info("Registration successful");
            return AuthResponse.builder()
                    .token(token)
                    .build();
                    
        } catch (Exception e) {
            log.error("Registration failed", e);
            throw e;
        }
    }
    
    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        var user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        var token = jwtService.generateToken(user);
        return AuthResponse.builder()
                .token(token)
                .build();
    }
} 