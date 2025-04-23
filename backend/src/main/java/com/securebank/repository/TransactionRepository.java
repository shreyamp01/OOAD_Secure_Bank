package com.securebank.repository;

import com.securebank.model.Account;
import com.securebank.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByAccount(Account account);
    List<Transaction> findByAccountAndCreatedAtBetween(Account account, LocalDateTime start, LocalDateTime end);
    List<Transaction> findByAccountOrderByCreatedAtDesc(Account account);
} 