package com.g_wuy.swp391.voltera.service;

import com.g_wuy.swp391.voltera.entity.*;
import com.g_wuy.swp391.voltera.exception.BusinessException;
import com.g_wuy.swp391.voltera.mapper.RefundMapper;
import com.g_wuy.swp391.voltera.model.response.RefundResponse;
import com.g_wuy.swp391.voltera.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestHeader;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class RefundService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RefundRepository refundRepository;
    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private RefundMapper refundMapper;
    @Autowired
    private BankRepository bankRepository;
    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private BankTransferRepository bankTransferRepository;

    public ResponseEntity<RefundResponse> createRefund(String reason, Integer transactionId, @RequestHeader("Authorization") String token) {
        User sender = getUserByToken(token);

        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new BusinessException("Transaction not found"));

        if (!"DONE".equalsIgnoreCase(transaction.getTransactionStatus())) {
            throw new  BusinessException("This transaction haven't been done");
        }

        User receiver = transaction.getPost().getSellerId();
        if (receiver == null) {
            throw new  BusinessException("Receiver not found");
        }
        Refund refund = Refund.builder()
                .transaction(transaction)
                .sender(sender)
                .receiver(receiver)
                .amount(transaction.getPrice())
                .reason(reason)
                .refundStatus("REQUESTED")
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        refundRepository.save(refund);
        return ResponseEntity.ok(refundMapper.toRefundResponse(refund));
    }

    public ResponseEntity<List<RefundResponse>> findRefundsBySenderId(@RequestHeader("Authorization") String token, String status) {
        List<RefundResponse> refundResponses;

        User sender = getUserByToken(token);

        if ("".equalsIgnoreCase(status) || status == null) {
            refundResponses = refundRepository.getAllRefundBySenderId(sender.getId());
        }
        else {
            refundResponses = refundRepository.getRefundBySenderIdAndStatus(sender.getId(), status);
        }
        return ResponseEntity.ok(refundResponses);
    }

    public ResponseEntity<List<RefundResponse>> findRefundsByReceiverId(@RequestHeader("Authorization") String token, String status) {
        List<RefundResponse> refundResponses;
        User receiver = getUserByToken(token);


        if ("".equalsIgnoreCase(status) || status == null) {
            refundResponses = refundRepository.getRefundByReceiverId(receiver.getId());
        }
        else {
            refundResponses = refundRepository.getRefundByReceiverIdAndStatus(receiver.getId(), status);
        }
        return ResponseEntity.ok(refundResponses);
    }

    public ResponseEntity<RefundResponse> updateRefundStatusAndGetMoneyFromSeller(
            Integer refundId,
            String status,
            @RequestHeader("Authorization") String token) {

        if (status == null || status.isBlank()) {
            throw new BusinessException("Status must not be empty");
        }

        Refund refund = refundRepository.findById(refundId)
                .orElseThrow(() -> new BusinessException("Refund not found"));

        User user = getUserByToken(token);
        User seller = refund.getReceiver();

        if (!seller.equals(user)) {
            throw new BusinessException("You are not the seller of this transaction");
        }

        List<String> validStatuses = List.of("APPROVED", "REJECTED");
        if (!validStatuses.contains(status.toUpperCase())) {
            throw new BusinessException("Invalid refund status");
        }

        refund.setRefundStatus(status.toUpperCase());
        refund.setUpdatedAt(Instant.now());
        refundRepository.save(refund);

        if ("APPROVED".equalsIgnoreCase(status)) {
            Bank bankSeller = bankRepository.findBankByUserId(seller.getId());
            if (bankSeller == null) {
                throw new BusinessException("Seller bank account not found");
            }

            BigDecimal amount = refund.getTransaction().getPrice();
            BigDecimal balance = bankSeller.getBalance();

            if (balance.compareTo(amount) < 0) {
                throw new BusinessException("Seller does not have enough balance to approve refund");
            }

            bankSeller.setBalance(balance.subtract(amount));
            bankRepository.save(bankSeller);

            BankTransfer bankTransfer = BankTransfer.builder()
                    .payment(paymentRepository.findPaymentByTransactionId(
                            refund.getTransaction().getTransactionid()))
                    .transaction(refund.getTransaction())
                    .seller(seller)
                    .bank(bankSeller)
                    .amount(amount)
                    .transferStatus("COMPLETED")
                    .initiatedAt(Instant.now())
                    .completedAt(Instant.now())
                    .description("Refund for " + refund.getSender().getFullname() + "ith posting " + refund.getTransaction().getPost().getTitle())
                    .build();
            bankTransferRepository.save(bankTransfer);
        }

        return ResponseEntity.ok(refundMapper.toRefundResponse(refund));
    }

    public User getUserByToken(String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            throw new BusinessException("Invalid token format");
        }

        String jwt = token.substring(7);
        String username = jwtService.extractUsername(jwt);
        if (username == null) {
            throw new BusinessException("Invalid token");
        }

        return userRepository.findUserByUsername(username);
    }
}