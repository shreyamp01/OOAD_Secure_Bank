package com.securebank.controller;

import com.securebank.dto.AccountRequest;
import com.securebank.dto.AccountResponse;
import com.securebank.dto.ErrorResponse;
import com.securebank.model.Account;
import com.securebank.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AccountController {

    private final AccountService accountService;
    private static final Logger logger = LoggerFactory.getLogger(AccountController.class);

    @PostMapping
    public ResponseEntity<?> createAccount(@RequestBody AccountRequest request, Authentication authentication) {
        try {
            logger.info("Creating account request received: {}", request);
            logger.info("User: {}", authentication.getName());
            
            // Validate request
            if (request.getInitialDeposit() == null || request.getInitialDeposit().doubleValue() <= 0) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Initial deposit must be greater than 0"));
            }
            if (request.getAccountType() == null) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Account type is required"));
            }
            
            AccountResponse response = accountService.createAccount(request, authentication.getName());
            logger.info("Account created successfully: {}", response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error creating account", e);
            return ResponseEntity.badRequest()
                .body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAccounts(Authentication authentication) {
        try {
            logger.info("Fetching accounts for user: {}", authentication.getName());
            List<AccountResponse> accounts = accountService.getAccountsByUsername(authentication.getName());
            return ResponseEntity.ok(accounts);
        } catch (Exception e) {
            logger.error("Error fetching accounts", e);
            return ResponseEntity.badRequest()
                .body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/{accountId}")
    public ResponseEntity<AccountResponse> getAccount(@PathVariable Long accountId, Authentication authentication) {
        return ResponseEntity.ok(accountService.getAccountById(accountId, authentication.getName()));
    }
} 