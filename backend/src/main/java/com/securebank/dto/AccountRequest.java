package com.securebank.dto;

import com.securebank.model.AccountType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountRequest {
    private AccountType accountType;
    private BigDecimal initialDeposit;
    private String purpose;
} 