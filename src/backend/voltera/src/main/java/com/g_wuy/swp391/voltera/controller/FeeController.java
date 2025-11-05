package com.g_wuy.swp391.voltera.controller;

import com.g_wuy.swp391.voltera.model.response.VNPayResponse;
import com.g_wuy.swp391.voltera.service.FeeService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/fee")
public class FeeController {
    @Autowired
    private FeeService feeService;

    @PostMapping("/create-payment/{transactionId}")
    public ResponseEntity<VNPayResponse> createFeeAndPay(
            @PathVariable("transactionId") Integer transactionId,
            HttpServletRequest request) {
        VNPayResponse response = feeService.createFeeAndPay(transactionId, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/renew/{postId}")
    public ResponseEntity<VNPayResponse> renewFee(
            @PathVariable("postId") Integer postId,
            HttpServletRequest request) {
        VNPayResponse response = feeService.renewFee(postId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/return/{transactionId}")
    public void handleReturn(
            @RequestParam Map<String, String> params,
            @PathVariable("transactionId") Integer transactionId,
            HttpServletResponse response) throws java.io.IOException {

        feeService.handleReturn(params, transactionId);

        StringBuilder frontendUrl = new StringBuilder("http://localhost:5173/payment/callback");
        frontendUrl.append("?");

        for (Map.Entry<String, String> entry : params.entrySet()) {
            frontendUrl.append(entry.getKey()).append("=").append(entry.getValue()).append("&");
        }

        if (frontendUrl.toString().endsWith("&")) {
            frontendUrl.setLength(frontendUrl.length() - 1);
        }

        response.sendRedirect(frontendUrl.toString());
    }

    // Admin endpoints to get fee statistics and list
    @GetMapping("/admin/all")
    public ResponseEntity<List<Object>> getAllFees() {
        try {
            List<Object> fees = feeService.getAllFeesForAdmin();
            return ResponseEntity.ok(fees);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/admin/stats")
    public ResponseEntity<Map<String, Object>> getFeeStats() {
        try {
            Map<String, Object> stats = feeService.getFeeStatistics();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
