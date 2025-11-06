package com.g_wuy.swp391.voltera.controller;

import com.g_wuy.swp391.voltera.model.response.RefundResponse;
import com.g_wuy.swp391.voltera.service.RefundService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/refund")
public class RefundController {

    @Autowired
    private RefundService refundService;

    @PostMapping("/request-refund/{transactionId}")
    public ResponseEntity<RefundResponse> createRefund(
            String reason,
            @PathVariable("transactionId") Integer transactionId,
            @RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(refundService.createRefund(reason, transactionId, token).getBody());
    }

    @GetMapping("/buyer/{refundStatus}")
    public ResponseEntity<List<RefundResponse>> getAllRefundsBySenderAndStatus(
            @RequestHeader("Authorization") String token,
            @PathVariable("refundStatus") String status) {
        return ResponseEntity.ok(refundService.findRefundsBySenderId(token, status).getBody());
    }

    @GetMapping("/seller/{refundStatus}")
    public ResponseEntity<List<RefundResponse>> getAllRefundsByReceiverAndStatus(
            @RequestHeader("Authorization") String token,
            @PathVariable("refundStatus") String status) {
        return ResponseEntity.ok(refundService.findRefundsByReceiverId(token, status).getBody());
    }
}