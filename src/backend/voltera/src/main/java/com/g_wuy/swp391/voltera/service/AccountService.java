package com.g_wuy.swp391.voltera.service;

import com.g_wuy.swp391.voltera.entity.Account;
import com.g_wuy.swp391.voltera.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class AccountService {
    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Account registerAccount(Account account) {
        if (accountRepository.existsByUsername(account.getUsername())) {
            throw new RuntimeException("Username is already taken");
        }
        account.setCreateat(Instant.now());
        account.setPassword(passwordEncoder.encode(account.getPassword()));
        return accountRepository.save(account);
    }

    public Account findAccountById(Integer id) {
        return accountRepository.findAccountById(id);
    }

    public Account approveAccount(Account account) {
        account.setStatus(Account.AccountStatus.ACTIVE);
        account.setUpdateat(Instant.now());
        return account;
    }

    public void saveAccount(Account account) {
        accountRepository.save(account);
    }

    public boolean isAccountExist(Integer id) {
        return accountRepository.existsById(id);
    }
}
