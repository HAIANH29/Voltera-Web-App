package com.g_wuy.swp391.voltera.service;

import com.g_wuy.swp391.voltera.exception.BusinessException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.g_wuy.swp391.voltera.entity.Account;
import com.g_wuy.swp391.voltera.repository.AccountRepository;

@Service

public class UserDetailImplementService implements UserDetailsService {
    @Autowired
    private AccountRepository accountRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException("Account not found" ));

        // Trả về Account trực tiếp vì nó đã implement UserDetails
        // và có getAuthorities() đúng format "ROLE_ADMIN"
        return account;
    }
}
