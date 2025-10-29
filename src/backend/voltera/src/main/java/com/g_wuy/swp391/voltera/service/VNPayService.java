package com.g_wuy.swp391.voltera.service;

import com.g_wuy.swp391.voltera.configuration.VNPayConfiguration;
import com.g_wuy.swp391.voltera.entity.Payment;
import com.g_wuy.swp391.voltera.entity.Transaction;
import com.g_wuy.swp391.voltera.model.request.VNPayRequest;
import com.g_wuy.swp391.voltera.model.response.VNPayResponse;
import com.g_wuy.swp391.voltera.repository.PaymentRepository;
import com.g_wuy.swp391.voltera.repository.TransactionRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.TreeMap;

@Slf4j
@Service
@Transactional
public class VNPayService {

    @Autowired
    private VNPayConfiguration vnPayConfig;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    public VNPayResponse createPayment(VNPayRequest request, HttpServletRequest httpRequest, Integer transactionId) {
        try {
            String vnp_TxnRef = VNPayConfiguration.getRandomNumber(8);
            String vnp_IpAddr = VNPayConfiguration.getIpAddress(httpRequest);

            String returnUrlWithTxn = vnPayConfig.getVnpReturnUrl() + "/" + transactionId;

            Map<String, String> vnp_Params = new TreeMap<>();
            vnp_Params.put("vnp_Version", vnPayConfig.getVnpVersion());
            vnp_Params.put("vnp_Command", "pay");
            vnp_Params.put("vnp_TmnCode", vnPayConfig.getVnpTmnCode());
            vnp_Params.put("vnp_Amount", String.valueOf(request.getAmount() * 100));
            vnp_Params.put("vnp_CurrCode", "VND");
            vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
            vnp_Params.put("vnp_OrderInfo", request.getOrderInfo());
            vnp_Params.put("vnp_OrderType", "other");
            vnp_Params.put("vnp_Locale", "vn");
            vnp_Params.put("vnp_ReturnUrl", returnUrlWithTxn);
            vnp_Params.put("vnp_IpAddr", vnp_IpAddr);
            
            // Support multiple payment methods including MoMo via VNPay
            // Empty bankCode allows user to choose payment method on VNPay page
            vnp_Params.put("vnp_BankCode", "");

            String createDate = LocalDateTime.now()
                    .format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
            vnp_Params.put("vnp_CreateDate", createDate);

            // Fix signature generation - use VNPay standard method
            String vnp_SecureHash = vnPayConfig.hashAllFields(vnp_Params);
            log.info("🔐 Generated SecureHash: {}", vnp_SecureHash);
            log.info("📋 VNPay params: {}", vnp_Params);
            
            StringBuilder query = new StringBuilder();
            for (Map.Entry<String, String> entry : vnp_Params.entrySet()) {
                query.append(URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8))
                        .append('=')
                        .append(URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8))
                        .append('&');
            }

            String paymentUrl = vnPayConfig.getVnpPayUrl() + "?" + query + "vnp_SecureHash=" + vnp_SecureHash;
            log.info("💳 Final payment URL: {}", paymentUrl);

            return VNPayResponse.builder()
                    .code("00")
                    .message("success")
                    .paymentUrl(paymentUrl)
                    .build();
        } catch (Exception e) {
            log.error("Error creating payment", e);
            return VNPayResponse.builder()
                    .code("99")
                    .message("Error: " + e.getMessage())
                    .build();
        }
    }

    public String handleReturn(Map<String, String> params, Integer transactionId) {
        try {
            String vnpSecureHash = params.get("vnp_SecureHash");
            params.remove("vnp_SecureHash");
            params.remove("vnp_SecureHashType");

            String signValue = vnPayConfig.hashAllFields(params);

            if (!signValue.equalsIgnoreCase(vnpSecureHash)) {
                log.error("Invalid checksum. Expected {}, got {}", vnpSecureHash, signValue);
                return "Lỗi xác minh chữ ký!";
            }

            Transaction transaction = transactionRepository.findById(transactionId)
                    .orElseThrow(() -> new RuntimeException("Transaction not found"));

            BigDecimal amount = new BigDecimal(params.get("vnp_Amount")).divide(BigDecimal.valueOf(100));
            transaction.setPrice(amount);
            transaction.setUpdateAt(Instant.now());

            Payment payment = new Payment();
            payment.setTransaction(transaction);
            payment.setPaymentMethod("VNPAY");
            payment.setTransactionCode(params.get("vnp_TxnRef"));
            payment.setPaymentDate(LocalDateTime.now());
            payment.setVnpTransactionNo(params.get("vnp_TransactionNo"));
            payment.setVnpBankCode(params.get("vnp_BankCode"));
            payment.setVnpBankTranNo(params.get("vnp_BankTranNo"));
            payment.setVnpCardType(params.get("vnp_CardType"));
            payment.setVnpPayDate(params.get("vnp_PayDate"));
            payment.setVnpResponseCode(params.get("vnp_ResponseCode"));
            payment.setAmount(amount);
            payment.setOrderInfo(params.get("vnp_OrderInfo"));

            if ("00".equals(params.get("vnp_ResponseCode"))) {
                transaction.setTransactionStatus("DONE");
                payment.setPaymentStatus("COMPLETED");
                paymentRepository.save(payment);
                transactionRepository.save(transaction);
                return "Giao dịch thành công!";
            } else {
                transaction.setTransactionStatus("FAILED");
                payment.setPaymentStatus("FAILED");
                paymentRepository.save(payment);
                transactionRepository.save(transaction);
                return "Giao dịch thất bại, mã lỗi: " + params.get("vnp_ResponseCode");
            }
        } catch (Exception e) {
            log.error("Error handling VNPay return", e);
            return "Lỗi xử lý callback: " + e.getMessage();
        }
    }
}