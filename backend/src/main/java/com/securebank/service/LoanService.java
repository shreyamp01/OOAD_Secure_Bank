package com.securebank.service;

import com.securebank.dto.LoanRequest;
import com.securebank.dto.LoanResponse;
import com.securebank.model.Loan;
import com.securebank.model.LoanStatus;
import com.securebank.model.User;
import com.securebank.repository.LoanRepository;
import com.securebank.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class LoanService {

    private final LoanRepository loanRepository;
    private final UserRepository userRepository;

    @Transactional
    public LoanResponse applyForLoan(LoanRequest request, String username) {
        log.info("Processing loan application for user: {} with request: {}", username, request);
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Validate loan application
        validateLoanApplication(request);

        // Calculate loan details
        BigDecimal interestRate = calculateInterestRate(request);
        BigDecimal monthlyPayment = calculateMonthlyPayment(request.getAmount(), 
                                                          request.getTermMonths(), 
                                                          interestRate);
        BigDecimal totalInterest = calculateTotalInterest(monthlyPayment, 
                                                        request.getTermMonths(), 
                                                        request.getAmount());

        Loan loan = Loan.builder()
                .user(user)
                .amount(request.getAmount())
                .termMonths(request.getTermMonths())
                .interestRate(interestRate)
                .purpose(request.getPurpose())
                .employmentStatus(request.getEmploymentStatus())
                .monthlyIncome(request.getMonthlyIncome())
                .collateral(request.getCollateral())
                .status(LoanStatus.PENDING)
                .monthlyPayment(monthlyPayment)
                .totalInterest(totalInterest)
                .remainingPayments(request.getTermMonths())
                .createdAt(LocalDateTime.now())
                .build();

        Loan savedLoan = loanRepository.save(loan);
        return mapToLoanResponse(savedLoan);
    }

    public List<LoanResponse> getLoansByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return loanRepository.findByUser(user).stream()
                .map(this::mapToLoanResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public LoanResponse approveLoan(Long loanId) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        if (loan.getStatus() != LoanStatus.PENDING) {
            throw new RuntimeException("Loan is not in PENDING status");
        }

        loan.setStatus(LoanStatus.APPROVED);
        loan.setStartDate(LocalDateTime.now());
        loan.setNextPaymentDate(LocalDateTime.now().plusMonths(1));

        return mapToLoanResponse(loanRepository.save(loan));
    }

    @Transactional
    public LoanResponse makePayment(Long loanId) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        if (loan.getStatus() != LoanStatus.APPROVED && loan.getStatus() != LoanStatus.ACTIVE) {
            throw new RuntimeException("Loan is not in APPROVED or ACTIVE status");
        }

        if (loan.getRemainingPayments() <= 0) {
            throw new RuntimeException("Loan is already paid off");
        }

        loan.setRemainingPayments(loan.getRemainingPayments() - 1);
        loan.setNextPaymentDate(loan.getNextPaymentDate().plusMonths(1));
        loan.setStatus(LoanStatus.ACTIVE);

        if (loan.getRemainingPayments() == 0) {
            loan.setStatus(LoanStatus.COMPLETED);
        }

        return mapToLoanResponse(loanRepository.save(loan));
    }

    private void validateLoanApplication(LoanRequest request) {
        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Loan amount must be greater than zero");
        }
        if (request.getTermMonths() <= 0) {
            throw new RuntimeException("Loan term must be greater than zero");
        }
        if (request.getMonthlyIncome().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Monthly income must be greater than zero");
        }
    }

    private BigDecimal calculateInterestRate(LoanRequest request) {
        // Basic interest rate calculation based on term length and income
        // This is a simplified version - in real world would be more complex
        BigDecimal baseRate = new BigDecimal("5.0");
        
        // Adjust based on term length
        if (request.getTermMonths() > 36) {
            baseRate = baseRate.add(new BigDecimal("1.0"));
        }
        
        // Adjust based on income
        BigDecimal monthlyPaymentToIncomeRatio = request.getAmount()
                .divide(request.getMonthlyIncome(), 2, RoundingMode.HALF_UP);
        if (monthlyPaymentToIncomeRatio.compareTo(new BigDecimal("0.3")) > 0) {
            baseRate = baseRate.add(new BigDecimal("0.5"));
        }
        
        return baseRate;
    }

    private BigDecimal calculateMonthlyPayment(BigDecimal principal, Integer termMonths, BigDecimal annualRate) {
        // Convert annual rate to monthly rate
        BigDecimal monthlyRate = annualRate.divide(new BigDecimal("1200"), 10, RoundingMode.HALF_UP);
        
        // Calculate monthly payment using loan amortization formula
        // P * (r * (1 + r)^n) / ((1 + r)^n - 1)
        // where P = principal, r = monthly rate, n = number of payments
        
        BigDecimal onePlusRate = BigDecimal.ONE.add(monthlyRate);
        BigDecimal rateFactorPow = onePlusRate.pow(termMonths);
        
        return principal.multiply(monthlyRate.multiply(rateFactorPow))
                .divide(rateFactorPow.subtract(BigDecimal.ONE), 2, RoundingMode.HALF_UP);
    }

    private BigDecimal calculateTotalInterest(BigDecimal monthlyPayment, Integer termMonths, BigDecimal principal) {
        return monthlyPayment.multiply(new BigDecimal(termMonths))
                .subtract(principal)
                .setScale(2, RoundingMode.HALF_UP);
    }

    private LoanResponse mapToLoanResponse(Loan loan) {
        return LoanResponse.builder()
                .id(loan.getId())
                .amount(loan.getAmount())
                .termMonths(loan.getTermMonths())
                .interestRate(loan.getInterestRate())
                .purpose(loan.getPurpose())
                .status(loan.getStatus())
                .startDate(loan.getStartDate())
                .nextPaymentDate(loan.getNextPaymentDate())
                .monthlyPayment(loan.getMonthlyPayment())
                .totalInterest(loan.getTotalInterest())
                .remainingPayments(loan.getRemainingPayments())
                .createdAt(loan.getCreatedAt())
                .build();
    }
} 