package com.g_wuy.swp391.voltera.controller;

import com.g_wuy.swp391.voltera.model.request.VNPayRequest;
import com.g_wuy.swp391.voltera.model.response.VNPayRefundResponse;
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
        try {
            VNPayResponse response = vnPayService.createPayment(request, httpRequest, transactionId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error creating VNPay payment: ", e);
            VNPayResponse errorResponse = new VNPayResponse();
            errorResponse.setCode("99");
            errorResponse.setMessage("Error creating payment: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/return/{transactionId}")
    public void handleReturn(
            @RequestParam Map<String, String> params,
            @PathVariable("transactionId") Integer transactionId,
            HttpServletRequest request,
            HttpServletResponse response) throws java.io.IOException {

        // Log incoming request details to help diagnose any issues
        try {
            StringBuilder headers = new StringBuilder();
            var headerNames = request.getHeaderNames();
            if (headerNames != null) {
                while (headerNames.hasMoreElements()) {
                    String name = headerNames.nextElement();
                    headers.append(name).append(": ").append(request.getHeader(name)).append("; ");
                }
            }

            log.info("VNPay return endpoint invoked: transactionId={} remoteAddr={} method={} headers={} params={}",
                    transactionId,
                    request.getRemoteAddr(),
                    request.getMethod(),
                    headers.toString(),
                    params.toString());
        } catch (Exception e) {
            log.warn("Failed to log VNPay return request details", e);
        }

        vnPayService.handleReturn(params, transactionId, null);

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

    @PostMapping("/refund/{refundId}")
    public ResponseEntity<VNPayRefundResponse> refund(
            @PathVariable("refundId") Integer refundId,
            HttpServletRequest request) {
        return ResponseEntity.ok(vnPayService.refund(request, refundId));
    }
}