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

    public ResponseEntity<List<TransactionResponse>> getTransactionByStatus(String status, String token) {
        String jwt = token.substring(7);
        String username = jwtService.extractUsername(jwt);
        User user = userRepository.findUserByUsername(username);

        List<TransactionResponse> transactionResponseList;

        if (status == null || status.isEmpty()) {
            // Nếu không truyền status -> lấy tất cả giao dịch của user
            List<Transaction> transactions = transactionRepository.findTransactionsByUser(username);
            transactionResponseList = transactions.stream()
                    .map(transactionMapper::toResponse)
                    .toList();
        } else {
            // Nếu có status -> lấy theo userId + status
            transactionResponseList = transactionRepository.findTransactionByStatus(user.getId(), status);
        }

        return ResponseEntity.ok(transactionResponseList);
    }

}
