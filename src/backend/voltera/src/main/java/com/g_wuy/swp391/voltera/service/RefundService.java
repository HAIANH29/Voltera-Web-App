package com.g_wuy.swp391.voltera.service;

import com.g_wuy.swp391.voltera.entity.Refund;
import com.g_wuy.swp391.voltera.entity.Transaction;
import com.g_wuy.swp391.voltera.entity.User;
import com.g_wuy.swp391.voltera.exception.BusinessException;
import com.g_wuy.swp391.voltera.mapper.RefundMapper;
import com.g_wuy.swp391.voltera.model.response.RefundResponse;
import com.g_wuy.swp391.voltera.repository.RefundRepository;
import com.g_wuy.swp391.voltera.repository.TransactionRepository;
import com.g_wuy.swp391.voltera.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestHeader;

import java.time.Instant;
import java.util.List;

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

//    public ResponseEntity<RefundResponse> updateRefundStatus(
//            Integer refundId,
//            String status,
//            @RequestHeader("Authorization") String token) {
//
//    }

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