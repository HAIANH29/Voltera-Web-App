package com.g_wuy.swp391.voltera.controller;

import com.g_wuy.swp391.voltera.model.request.PaymentQueryRequest;
import com.g_wuy.swp391.voltera.model.request.VNPayRefundRequest;
import com.g_wuy.swp391.voltera.model.request.VNPayRequest;
import com.g_wuy.swp391.voltera.model.response.VNPayResponse;
import com.g_wuy.swp391.voltera.model.response.VnPayCallBackResponse;
import com.g_wuy.swp391.voltera.service.PaymentService;
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

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create-payment")
    public ResponseEntity<VNPayResponse> createPayment(
            @RequestBody VNPayRequest request,
            HttpServletRequest httpRequest) {
        try {
            String paymentUrl = vnPayService.createPaymentUrl(request, httpRequest);

            VNPayResponse response = VNPayResponse.builder()
                    .code("00")
                    .message("success")
                    .paymentUrl(paymentUrl)
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error creating payment", e);
            VNPayResponse response = VNPayResponse.builder()
                    .code("99")
                    .message("Error: " + e.getMessage())
                    .build();
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/return")
    public ResponseEntity<?> handleReturn(@RequestParam Map<String, String> params) {
        try {
            VnPayCallBackResponse callback = vnPayService.handleCallback(params);

            // Check transaction status
            if ("00".equals(callback.getVnpResponseCode())) {
                log.info("Payment successful for transaction: {}", callback.getVnpTxnRef());
                return ResponseEntity.ok("Giao dịch thành công");
            } else {
                log.warn("Payment failed for transaction: {}", callback.getVnpTxnRef());
                return ResponseEntity.ok("Giao dịch không thành công");
            }
        } catch (Exception e) {
            log.error("Error handling return", e);
            return ResponseEntity.badRequest().body("Chữ ký không hợp lệ");
        }
    }

    @GetMapping("/ipn")
    public ResponseEntity<String> handleIPN(@RequestParam Map<String, String> params) {
        try {
            String response = vnPayService.handleIPN(params);
            return ResponseEntity.ok()
                    .header("Content-Type", "application/json")
                    .body(response);
        } catch (Exception e) {
            log.error("Error handling IPN", e);
            return ResponseEntity.ok()
                    .header("Content-Type", "application/json")
                    .body("{\"RspCode\":\"99\",\"Message\":\"Unknown error\"}");
        }
    }

    @PostMapping("/query")
    public ResponseEntity<String> queryTransaction(
            @RequestBody PaymentQueryRequest request,
            HttpServletRequest httpRequest) {
        try {
            String response = vnPayService.queryTransaction(request, httpRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error querying transaction", e);
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/refund")
    public ResponseEntity<String> refundTransaction(
            @RequestBody VNPayRefundRequest request,
            HttpServletRequest httpRequest) {
        try {
            String response = vnPayService.refundTransaction(request, httpRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error refunding transaction", e);
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
