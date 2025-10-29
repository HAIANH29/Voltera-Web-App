package com.g_wuy.swp391.voltera.service;

import com.g_wuy.swp391.voltera.entity.Payment;
import com.g_wuy.swp391.voltera.entity.Transaction;
import com.g_wuy.swp391.voltera.repository.PaymentRepository;
import com.g_wuy.swp391.voltera.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
public class TransactionScheduler {
    @Autowired
    private TransactionRepository transactionRepository;

    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void cancelExpiredTransactions() {
        Instant fifteenDaysAgo = Instant.now().minus(15, ChronoUnit.DAYS);

        List<Transaction> expiredTransactions = transactionRepository.findAll().stream()
                .filter(t -> "PENDING".equalsIgnoreCase(t.getTransactionStatus()))
                .filter(t -> t.getCreateAt().isBefore(fifteenDaysAgo))
                .toList();

        for (Transaction t : expiredTransactions) {
            t.setTransactionStatus("FAILED");
            transactionRepository.save(t);
        }
    }
}