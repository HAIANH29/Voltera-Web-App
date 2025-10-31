package com.g_wuy.swp391.voltera.controller;

import com.g_wuy.swp391.voltera.model.response.VNPayResponse;
import com.g_wuy.swp391.voltera.service.FeeService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/fee")
public class FeeController {
    @Autowired
    private FeeService feeService;

    @PostMapping("/create-payment/{postId}")
    public ResponseEntity<VNPayResponse> createFeeAndPay(
            @PathVariable Integer postId,
            HttpServletRequest request) {
        VNPayResponse response = feeService.createFeeAndPay(postId, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/renew/{postId}")
    public ResponseEntity<VNPayResponse> renewFee(
            @PathVariable("postId") Integer postId,
            HttpServletRequest request) {
        VNPayResponse response = feeService.renewFee(postId, request);
        return ResponseEntity.ok(response);
    }
}
