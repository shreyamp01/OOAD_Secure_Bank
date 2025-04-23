package com.securebank.repository;

import com.securebank.model.Loan;
import com.securebank.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LoanRepository extends JpaRepository<Loan, Long> {
    List<Loan> findByUser(User user);
    List<Loan> findByUserOrderByCreatedAtDesc(User user);
} 