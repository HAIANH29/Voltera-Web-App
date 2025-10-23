package com.g_wuy.swp391.voltera.service;

import com.g_wuy.swp391.voltera.entity.Payment;
import com.g_wuy.swp391.voltera.model.response.VnPayCallBackResponse;
import com.g_wuy.swp391.voltera.repository.PaymentRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Service
@Slf4j
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    /**
     * Tạo payment record mới khi khởi tạo giao dịch
     */
//    @Transactional
//    public Payment createPayment(Integer transactionId, String transactionCode,
//                                 BigDecimal amount, String orderInfo) {
//        Payment payment = Payment.builder()
//                .transaction(transactionId)
//                .transactionCode(transactionCode)
//                .amount(amount)
//                .orderInfo(orderInfo)
//                .paymentMethod("VNPAY")
//                .paymentStatus("PENDING")
//                .build();
//
//        return paymentRepository.save(payment);
//    }

    /**
     * Cập nhật payment sau khi nhận callback từ VNPay
     */
    @Transactional
    public Payment updatePaymentFromCallback(VnPayCallBackResponse callback) {
        Optional<Payment> paymentOpt = paymentRepository.findByTransactionCode(callback.getVnpTxnRef());

        if (!paymentOpt.isPresent()) {
            log.error("Payment not found for transaction code: {}", callback.getVnpTxnRef());
            throw new RuntimeException("Payment not found");
        }

        Payment payment = paymentOpt.get();

        // Kiểm tra xem payment đã được xử lý chưa
        if (!"PENDING".equals(payment.getPaymentStatus())) {
            log.warn("Payment already processed: {}", payment.getTransactionCode());
            throw new RuntimeException("Payment already processed");
        }

        // Kiểm tra số tiền
        BigDecimal callbackAmount = BigDecimal.valueOf(callback.getVnpAmount() / 100);
        if (payment.getAmount().compareTo(callbackAmount) != 0) {
            log.error("Amount mismatch. Expected: {}, Got: {}",
                    payment.getAmount(), callbackAmount);
            throw new RuntimeException("Invalid amount");
        }

        // Cập nhật thông tin từ VNPay
        payment.setVnpTransactionNo(callback.getVnpTransactionNo());
        payment.setVnpBankCode(callback.getVnpBankCode());
        payment.setVnpBankTranNo(callback.getVnpBankTranNo());
        payment.setVnpCardType(callback.getVnpCardType());
        payment.setVnpPayDate(callback.getVnpPayDate());
        payment.setVnpResponseCode(callback.getVnpResponseCode());

        // Cập nhật trạng thái thanh toán
        if ("00".equals(callback.getVnpResponseCode())) {
            payment.setPaymentStatus("SUCCESS");
            payment.setPaymentDate(parseVnpPayDate(callback.getVnpPayDate()));
        } else {
            payment.setPaymentStatus("FAILED");
        }

        return paymentRepository.save(payment);
    }

    /**
     * Kiểm tra payment tồn tại và đang pending
     */
    public boolean isValidPendingPayment(String transactionCode) {
        Optional<Payment> paymentOpt = paymentRepository.findByTransactionCode(transactionCode);
        return paymentOpt.isPresent() && "PENDING".equals(paymentOpt.get().getPaymentStatus());
    }

    /**
     * Lấy payment theo transaction code
     */
    public Optional<Payment> getPaymentByTransactionCode(String transactionCode) {
        return paymentRepository.findByTransactionCode(transactionCode);
    }

    /**
     * Lấy payment theo VNPay transaction number
     */
    public Optional<Payment> getPaymentByVnpTransactionNo(String vnpTransactionNo) {
        return paymentRepository.findByVnpTransactionNo(vnpTransactionNo);
    }

    /**
     * Parse VNPay date format (yyyyMMddHHmmss) to LocalDateTime
     */
    private LocalDateTime parseVnpPayDate(String vnpPayDate) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
            return LocalDateTime.parse(vnpPayDate, formatter);
        } catch (Exception e) {
            log.error("Error parsing VNPay date: {}", vnpPayDate, e);
            return LocalDateTime.now();
        }
    }

    /**
     * Kiểm tra payment đã tồn tại
     */
    public boolean existsByTransactionCode(String transactionCode) {
        return paymentRepository.existsByTransactionCode(transactionCode);
    }
}
