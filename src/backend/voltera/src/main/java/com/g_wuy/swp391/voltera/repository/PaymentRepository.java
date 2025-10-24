package com.g_wuy.swp391.voltera.repository;

import com.g_wuy.swp391.voltera.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    Optional<Payment> findByTransactionCode(String transactionCode);

    Optional<Payment> findByVnpTransactionNo(String vnpTransactionNo);

    boolean existsByTransactionCode(String transactionCode);
}
