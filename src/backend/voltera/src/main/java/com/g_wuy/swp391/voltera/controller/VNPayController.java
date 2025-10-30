package com.g_wuy.swp391.voltera.controller;

import com.g_wuy.swp391.voltera.model.request.VNPayRequest;
import com.g_wuy.swp391.voltera.model.response.VNPayResponse;
import com.g_wuy.swp391.voltera.service.VNPayService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/vnpay")
@Slf4j
public class VNPayController {

    @Autowired
    private VNPayService vnPayService;

    @PostMapping("/create-payment/{transactionId}")
    public ResponseEntity<VNPayResponse> createPayment(
            @RequestBody VNPayRequest request,
            HttpServletRequest httpRequest,
            @PathVariable("transactionId") String transactionId) {
        VNPayResponse response = vnPayService.createPayment(request, httpRequest, transactionId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/return/{transactionId}")
    public ResponseEntity<String> handleReturn(
            @RequestParam Map<String, String> params,
            @PathVariable("transactionId") Integer transactionId) {
        String result = vnPayService.handleReturn(params, transactionId);
        return ResponseEntity.ok(result);
    }
}
