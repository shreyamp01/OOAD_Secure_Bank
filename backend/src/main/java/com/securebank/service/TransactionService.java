package com.securebank.service;

import com.securebank.dto.TransactionRequest;
import com.securebank.dto.TransactionResponse;
import com.securebank.model.Account;
import com.securebank.model.Transaction;
import com.securebank.model.TransactionStatus;
import com.securebank.model.TransactionType;
import com.securebank.repository.AccountRepository;
import com.securebank.repository.TransactionRepository;
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
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;

    @Transactional
    public TransactionResponse createTransaction(TransactionRequest request) {
        log.info("Creating transaction for account ID: {} with request: {}", request.getAccountId(), request);
        
        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        // Validate transaction
        validateTransaction(account, request);

        // Update account balance
        updateAccountBalance(account, request);

        // Create transaction
        Transaction transaction = Transaction.builder()
                .account(account)
                .amount(request.getAmount())
                .description(request.getDescription())
                .type(request.getType())
                .category(request.getCategory())
                .referenceNumber(generateReferenceNumber())
                .location(request.getLocation())
                .status(TransactionStatus.COMPLETED)
                .createdAt(LocalDateTime.now())
                .build();

        Transaction savedTransaction = transactionRepository.save(transaction);
        
        // Update account's last transaction date
        account.setLastTransactionDate(LocalDateTime.now());
        accountRepository.save(account);

        return mapToTransactionResponse(savedTransaction);
    }

    public List<TransactionResponse> getTransactionsByAccountId(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        return transactionRepository.findByAccountOrderByCreatedAtDesc(account).stream()
                .map(this::mapToTransactionResponse)
                .collect(Collectors.toList());
    }

    private void validateTransaction(Account account, TransactionRequest request) {
        if (request.getType() == TransactionType.WITHDRAWAL || 
            request.getType() == TransactionType.TRANSFER) {
            if (account.getBalance().compareTo(request.getAmount()) < 0) {
                throw new RuntimeException("Insufficient funds");
            }
        }
    }

    private void updateAccountBalance(Account account, TransactionRequest request) {
        BigDecimal currentBalance = account.getBalance();
        BigDecimal newBalance;

        switch (request.getType()) {
            case DEPOSIT:
                newBalance = currentBalance.add(request.getAmount());
                break;
            case WITHDRAWAL:
            case TRANSFER:
                newBalance = currentBalance.subtract(request.getAmount());
                break;
            default:
                throw new RuntimeException("Invalid transaction type");
        }

        account.setBalance(newBalance);
    }

    private String generateReferenceNumber() {
        Random random = new Random();
        StringBuilder sb = new StringBuilder("TXN-");
        for (int i = 0; i < 8; i++) {
            sb.append(random.nextInt(10));
        }
        return sb.toString();
    }

    private TransactionResponse mapToTransactionResponse(Transaction transaction) {
        return TransactionResponse.builder()
                .id(transaction.getId())
                .accountNumber(transaction.getAccount().getAccountNumber())
                .description(transaction.getDescription())
                .amount(transaction.getAmount())
                .type(transaction.getType())
                .category(transaction.getCategory())
                .referenceNumber(transaction.getReferenceNumber())
                .location(transaction.getLocation())
                .status(transaction.getStatus())
                .createdAt(transaction.getCreatedAt())
                .build();
    }
} 