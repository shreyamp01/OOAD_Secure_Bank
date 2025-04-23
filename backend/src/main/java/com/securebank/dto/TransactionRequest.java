package com.securebank.dto;

import com.securebank.model.TransactionType;
import com.securebank.model.TransactionCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionRequest {
    private Long accountId;
    private BigDecimal amount;
    private String description;
    private TransactionType type;
    private TransactionCategory category;
    private String location;
} 