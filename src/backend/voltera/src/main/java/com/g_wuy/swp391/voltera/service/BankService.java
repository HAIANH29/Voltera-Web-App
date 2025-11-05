package com.g_wuy.swp391.voltera.service;

import com.g_wuy.swp391.voltera.entity.Bank;
import com.g_wuy.swp391.voltera.entity.User;
import com.g_wuy.swp391.voltera.exception.BusinessException;
import com.g_wuy.swp391.voltera.mapper.BankMapper;
import com.g_wuy.swp391.voltera.model.request.BankRequest;
import com.g_wuy.swp391.voltera.model.response.BankResponse;
import com.g_wuy.swp391.voltera.repository.BankRepository;
import com.g_wuy.swp391.voltera.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestHeader;

import javax.security.auth.login.LoginException;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.chrono.ChronoLocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class BankService {
    @Autowired
    private BankRepository bankRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BankMapper bankMapper;

    public ResponseEntity<BankResponse> saveBank(BankRequest request, @RequestHeader("Authorization") String jwt) {
        String token = jwt.substring(7);
        User user = userRepository.findUserByUsername(jwtService.extractUsername(token));
        Bank bank = new Bank();

        if (user == null) {
            throw new BusinessException("User not found");
        }
        bank.setUser(user);
        bank.setBankName(request.getBankName());
        int len = request.getBankNumber().length();
        if (len < 12 || len > 19) {
            throw new BusinessException("Bank number must be between 12 and 19 digits");
        }
        if (bankRepository.existsByBankNumber(request.getBankNumber())) {
            throw new BusinessException("Bank number already exists");
        }
        bank.setBankNumber(request.getBankNumber());
        bank.setAccountName(request.getAccountName());
        bank.setSecurityCode(request.getSecurityCode());
        if (request.getExpirationDate().isBefore(java.time.LocalDate.now())) {
            throw new BusinessException("Expiration date is invalid");
        }
        bank.setExpDate(request.getExpirationDate());
        bank.setUpdatedAt(Instant.now());
        bank.setBalance(BigDecimal.valueOf(0.0));
        bank.setStatus("ACTIVE");
        bankRepository.save(bank);
        return ResponseEntity.ok(bankMapper.toBankResponse(bank));
    }

    public ResponseEntity<BankResponse> myBanks(@RequestHeader("Authorization") String jwt) {
        String token = jwt.substring(7);
        User user = userRepository.findUserByUsername(jwtService.extractUsername(token));
        Bank bank = bankRepository.findByUserId(user.getId());
        return ResponseEntity.ok(bankMapper.toBankResponse(bank));
    }

    public ResponseEntity<List<BankResponse>> getAllBank(String status) {
        List<BankResponse> bankResponses;
        if ("".equalsIgnoreCase(status) || status == null) {
            bankResponses = bankRepository.getAllBank();
        }
        else {
            bankResponses = bankRepository.findAllByStatus(status);
        }
        return ResponseEntity.ok(bankResponses);
    }
}