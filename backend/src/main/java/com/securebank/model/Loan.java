package com.securebank.model;

import jakarta.persistence.*;
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
@Entity
@Table(name = "loans")
public class Loan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    private BigDecimal amount;
    private Integer termMonths;
    private BigDecimal interestRate;
    private String purpose;
    private String employmentStatus;
    private BigDecimal monthlyIncome;
    private String collateral;
    
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private LoanStatus status = LoanStatus.PENDING;
    
    private LocalDateTime startDate;
    private LocalDateTime nextPaymentDate;
    private BigDecimal monthlyPayment;
    private BigDecimal totalInterest;
    private Integer remainingPayments;
    
    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
} 