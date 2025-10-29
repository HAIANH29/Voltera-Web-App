package com.g_wuy.swp391.voltera.service;

import com.g_wuy.swp391.voltera.entity.Transaction;
import com.g_wuy.swp391.voltera.entity.User;
import com.g_wuy.swp391.voltera.mapper.TransactionMapper;
import com.g_wuy.swp391.voltera.model.response.TransactionResponse;
import com.g_wuy.swp391.voltera.repository.AccountRepository;
import com.g_wuy.swp391.voltera.repository.TransactionRepository;
import com.g_wuy.swp391.voltera.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.ArrayList;
import java.util.List;

@Service
public class TransactionService {
    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private TransactionMapper transactionMapper;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AccountRepository accountRepository;

    public ResponseEntity<List<TransactionResponse>> getTransactionByStatus(
            String status,
            @RequestHeader("Authorization") String token) {
        String jwt = token.substring(7);
        User user = userRepository.findUserByUsername(jwtService.extractUsername(jwt));
        List<TransactionResponse> transactionResponseList = new ArrayList<>();
        if (status == null || status.isEmpty()) {
            List<Transaction> transactions = transactionRepository.findTransactionsByUser(String.valueOf(accountRepository.findById(user.getId())));
             for (int i = 0; i < transactions.toArray().length; i++) {
                 transactionResponseList.add(transactionMapper.toResponse(transactions.get(i)));
            }
        }
        transactionResponseList = transactionRepository.findTransactionByStatus(user.getId(), status);
        return ResponseEntity.ok(transactionResponseList);
    }

}
