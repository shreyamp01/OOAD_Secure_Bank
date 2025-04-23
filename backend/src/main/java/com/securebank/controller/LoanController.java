package com.securebank.controller;

import com.securebank.dto.LoanRequest;
import com.securebank.dto.LoanResponse;
import com.securebank.dto.ErrorResponse;
import com.securebank.service.LoanService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class LoanController {

    private final LoanService loanService;
    private static final Logger logger = LoggerFactory.getLogger(LoanController.class);

    @PostMapping("/apply")
    public ResponseEntity<?> applyForLoan(@RequestBody LoanRequest request, Authentication authentication) {
        try {
            logger.info("Processing loan application: {}", request);
            LoanResponse response = loanService.applyForLoan(request, authentication.getName());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error processing loan application", e);
            return ResponseEntity.badRequest()
                .body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getLoans(Authentication authentication) {
        try {
            List<LoanResponse> loans = loanService.getLoansByUsername(authentication.getName());
            return ResponseEntity.ok(loans);
        } catch (Exception e) {
            logger.error("Error fetching loans", e);
            return ResponseEntity.badRequest()
                .body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/{loanId}/approve")
    public ResponseEntity<?> approveLoan(@PathVariable Long loanId) {
        try {
            LoanResponse response = loanService.approveLoan(loanId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error approving loan", e);
            return ResponseEntity.badRequest()
                .body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/{loanId}/payment")
    public ResponseEntity<?> makePayment(@PathVariable Long loanId) {
        try {
            LoanResponse response = loanService.makePayment(loanId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error processing loan payment", e);
            return ResponseEntity.badRequest()
                .body(new ErrorResponse(e.getMessage()));
        }
    }
} 