package com.g_wuy.swp391.voltera.controller;

import com.g_wuy.swp391.voltera.model.request.VNPayRequest;
import com.g_wuy.swp391.voltera.model.response.VNPayResponse;
import com.g_wuy.swp391.voltera.service.VNPayService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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
            @PathVariable("transactionId") Integer transactionId) {
        VNPayResponse response = vnPayService.createPayment(request, httpRequest, transactionId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/return/{transactionId}")
    public void handleReturn(
            @RequestParam Map<String, String> params,
            @PathVariable("transactionId") Integer transactionId,
            HttpServletResponse response) throws java.io.IOException {

        vnPayService.handleReturn(params, transactionId);

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
}