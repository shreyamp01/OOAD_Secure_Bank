package com.securebank.repository;

import com.securebank.model.Account;
import com.securebank.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {
    List<Account> findByUser(User user);
    Optional<Account> findByAccountNumber(String accountNumber);
    List<Account> findByUserAndActiveTrue(User user);
} 