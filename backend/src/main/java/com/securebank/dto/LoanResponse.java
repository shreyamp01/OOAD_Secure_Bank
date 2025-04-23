package com.securebank.dto;

import com.securebank.model.LoanStatus;
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
public class LoanResponse {
    private Long id;
    private BigDecimal amount;
    private Integer termMonths;
    private BigDecimal interestRate;
    private String purpose;
    private LoanStatus status;
    private LocalDateTime startDate;
    private LocalDateTime nextPaymentDate;
    private BigDecimal monthlyPayment;
    private BigDecimal totalInterest;
    private Integer remainingPayments;
    private LocalDateTime createdAt;
} 