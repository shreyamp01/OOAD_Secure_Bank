package com.securebank.controller;

import com.securebank.dto.TransactionRequest;
import com.securebank.dto.TransactionResponse;
import com.securebank.dto.ErrorResponse;
import com.securebank.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class TransactionController {

    private final TransactionService transactionService;
    private static final Logger logger = LoggerFactory.getLogger(TransactionController.class);

    @PostMapping
    public ResponseEntity<?> createTransaction(@RequestBody TransactionRequest request) {
        try {
            logger.info("Creating transaction with request: {}", request);
            
            // Validate request
            if (request.getAmount() == null || request.getAmount().doubleValue() <= 0) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Amount must be greater than 0"));
            }
            if (request.getType() == null) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Transaction type is required"));
            }
            
            TransactionResponse response = transactionService.createTransaction(request);
            logger.info("Transaction created successfully: {}", response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error creating transaction", e);
            return ResponseEntity.badRequest()
                .body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<?> getTransactions(@PathVariable Long accountId) {
        try {
            logger.info("Fetching transactions for account: {}", accountId);
            List<TransactionResponse> transactions = transactionService.getTransactionsByAccountId(accountId);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            logger.error("Error fetching transactions", e);
            return ResponseEntity.badRequest()
                .body(new ErrorResponse(e.getMessage()));
        }
    }
} 