package com.securebank.dto;

import com.securebank.model.TransactionType;
import com.securebank.model.TransactionCategory;
import com.securebank.model.TransactionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse {
    private Long id;
    private String accountNumber;
    private String description;
    private BigDecimal amount;
    private TransactionType type;
    private TransactionCategory category;
    private String referenceNumber;
    private String location;
    private TransactionStatus status;
    private LocalDateTime createdAt;
} 