package com.securebank.config;

import com.securebank.model.Account;
import com.securebank.model.AccountType;
import com.securebank.model.User;
import com.securebank.repository.AccountRepository;
import com.securebank.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Random;

@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationListener<ContextRefreshedEvent> {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public void onApplicationEvent(ContextRefreshedEvent event) {
        // This method will be called when the application starts
    }

    @Transactional
    public void createDefaultAccounts(User user) {
        // Create a Savings Account
        Account savingsAccount = Account.builder()
                .accountNumber(generateAccountNumber())
                .user(user)
                .accountType(AccountType.SAVINGS)
                .balance(new BigDecimal("10000.00"))
                .interestRate(new BigDecimal("2.5"))
                .purpose("Primary Savings")
                .active(true)
                .createdAt(LocalDateTime.now())
                .build();

        // Create a Checking Account
        Account checkingAccount = Account.builder()
                .accountNumber(generateAccountNumber())
                .user(user)
                .accountType(AccountType.CHECKING)
                .balance(new BigDecimal("5000.00"))
                .interestRate(new BigDecimal("0.1"))
                .purpose("Daily Expenses")
                .active(true)
                .createdAt(LocalDateTime.now())
                .build();

        accountRepository.save(savingsAccount);
        accountRepository.save(checkingAccount);
    }

    private String generateAccountNumber() {
        Random random = new Random();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 10; i++) {
            sb.append(random.nextInt(10));
        }
        return sb.toString();
    }
} 