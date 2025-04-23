package com.securebank.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoanRequest {
    private BigDecimal amount;
    private Integer termMonths;
    private String purpose;
    private String employmentStatus;
    private BigDecimal monthlyIncome;
    private String collateral;
} 