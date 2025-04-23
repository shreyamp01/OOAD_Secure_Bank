package com.securebank.service;

import com.securebank.dto.AccountRequest;
import com.securebank.dto.AccountResponse;
import com.securebank.model.Account;
import com.securebank.model.AccountType;
import com.securebank.model.User;
import com.securebank.repository.AccountRepository;
import com.securebank.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    @Transactional
    public AccountResponse createAccount(AccountRequest request, String username) {
        log.info("Creating account for user: {} with request: {}", username, request);
        
        try {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Account account = Account.builder()
                    .accountNumber(generateAccountNumber())
                    .user(user)
                    .accountType(request.getAccountType())
                    .balance(request.getInitialDeposit())
                    .interestRate(calculateInterestRate(request.getAccountType()))
                    .purpose(request.getPurpose())
                    .active(true)
                    .createdAt(LocalDateTime.now())
                    .build();

            log.info("Saving new account: {}", account);
            Account savedAccount = accountRepository.save(account);
            log.info("Account saved successfully: {}", savedAccount);
            
            return mapToAccountResponse(savedAccount);
        } catch (Exception e) {
            log.error("Error creating account", e);
            throw e;
        }
    }

    public List<AccountResponse> getAccountsByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return accountRepository.findByUserAndActiveTrue(user).stream()
                .map(this::mapToAccountResponse)
                .collect(Collectors.toList());
    }

    public AccountResponse getAccountById(Long accountId, String username) {
        log.info("Fetching account {} for user {}", accountId, username);
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        // Verify account ownership
        if (!account.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to account");
        }

        return mapToAccountResponse(account);
    }

    private String generateAccountNumber() {
        // Implementation of generateAccountNumber method
        return null; // Placeholder return, actual implementation needed
    }

    private BigDecimal calculateInterestRate(AccountType accountType) {
        // Implementation of calculateInterestRate method
        return null; // Placeholder return, actual implementation needed
    }

    private AccountResponse mapToAccountResponse(Account account) {
        return AccountResponse.builder()
                .id(account.getId())
                .accountNumber(account.getAccountNumber())
                .accountType(account.getAccountType())
                .balance(account.getBalance())
                .interestRate(account.getInterestRate())
                .purpose(account.getPurpose())
                .active(account.isActive())
                .createdAt(account.getCreatedAt())
                .build();
    }
} 