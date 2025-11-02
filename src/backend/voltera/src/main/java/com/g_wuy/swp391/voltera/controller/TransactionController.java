package com.g_wuy.swp391.voltera.controller;

import com.g_wuy.swp391.voltera.model.response.TransactionResponse;
import com.g_wuy.swp391.voltera.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @GetMapping("/{transactionStatus}")
    public ResponseEntity<List<TransactionResponse>> findTransactionsByUser(
            @RequestHeader("Authorization") String token,
            @PathVariable("transactionStatus") String transactionStatus) {
        return ResponseEntity.ok(transactionService.getTransactionByStatus(transactionStatus, token).getBody());
    }
}