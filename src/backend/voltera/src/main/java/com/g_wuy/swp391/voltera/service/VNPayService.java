package com.g_wuy.swp391.voltera.service;

import com.g_wuy.swp391.voltera.configuration.VNPayConfiguration;
import com.g_wuy.swp391.voltera.model.dto.*;
import com.g_wuy.swp391.voltera.model.request.PaymentQueryRequest;
import com.g_wuy.swp391.voltera.model.request.VNPayRefundRequest;
import com.g_wuy.swp391.voltera.model.request.VNPayRequest;
import com.g_wuy.swp391.voltera.model.response.VnPayCallBackResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@Slf4j
public class VNPayService {

    @Autowired
    private VNPayConfiguration vnPayConfiguration;

    public String createPaymentUrl(VNPayRequest request, HttpServletRequest httpRequest) {
        String vnpTxnRef = vnPayConfiguration.getRandomNumber(8);
        String vnpIpAddr = getIpAddress(httpRequest);

        long amount = request.getAmount() * 100;

        Map<String, String> vnpParams = new HashMap<>();
        vnpParams.put("vnp_Version", vnPayConfiguration.getVnpVersion());
        vnpParams.put("vnp_Command", "pay");
        vnpParams.put("vnp_TmnCode", vnPayConfiguration.getVnpTmnCode());
        vnpParams.put("vnp_Amount", String.valueOf(amount));
        vnpParams.put("vnp_CurrCode", "VND");

        if (request.getBankCode() != null && !request.getBankCode().isEmpty()) {
            vnpParams.put("vnp_BankCode", request.getBankCode());
        }

        vnpParams.put("vnp_TxnRef", vnpTxnRef);
        vnpParams.put("vnp_OrderInfo", request.getOrderInfo());
        vnpParams.put("vnp_OrderType", request.getOrderType() != null ? request.getOrderType() : "other");

        String locale = request.getLanguage();
        vnpParams.put("vnp_Locale", (locale != null && !locale.isEmpty()) ? locale : "vn");

        vnpParams.put("vnp_ReturnUrl", vnPayConfiguration.getVnpReturnUrl());
        vnpParams.put("vnp_IpAddr", vnpIpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnpCreateDate = formatter.format(cld.getTime());
        vnpParams.put("vnp_CreateDate", vnpCreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnpExpireDate = formatter.format(cld.getTime());
        vnpParams.put("vnp_ExpireDate", vnpExpireDate);

        List<String> fieldNames = new ArrayList<>(vnpParams.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnpParams.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));

                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));

                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }

        String queryUrl = query.toString();
        String vnpSecureHash = vnPayConfiguration.hmacSHA512(vnPayConfiguration.getSecretKey(), hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnpSecureHash;

        return vnPayConfiguration.getVnpPayUrl() + "?" + queryUrl;
    }

    public VnPayCallBackResponse handleCallback(Map<String, String> params) {
        // Lưu chữ ký gốc từ VNPAY
        String vnpSecureHash = params.get("vnp_SecureHash");

        // Loại bỏ các trường hash khỏi map để tái tạo chữ ký
        params.remove("vnp_SecureHashType");
        params.remove("vnp_SecureHash");

        // Tính lại chữ ký theo đúng chuẩn VNPAY
        String signValue = vnPayConfiguration.hashAllFields(params);

        // So sánh chữ ký không phân biệt hoa/thường
        if (!signValue.equalsIgnoreCase(vnpSecureHash)) {
            throw new RuntimeException("Invalid checksum: expected " + vnpSecureHash + " but got " + signValue);
        }

        // Nếu hợp lệ -> trả về response
        return VnPayCallBackResponse.builder()
                .vnpTmnCode(params.get("vnp_TmnCode"))
                .vnpAmount(Long.parseLong(params.get("vnp_Amount")))
                .vnpBankCode(params.get("vnp_BankCode"))
                .vnpBankTranNo(params.get("vnp_BankTranNo"))
                .vnpCardType(params.get("vnp_CardType"))
                .vnpPayDate(params.get("vnp_PayDate"))
                .vnpOrderInfo(params.get("vnp_OrderInfo"))
                .vnpTransactionNo(params.get("vnp_TransactionNo"))
                .vnpResponseCode(params.get("vnp_ResponseCode"))
                .vnpTransactionStatus(params.get("vnp_TransactionStatus"))
                .vnpTxnRef(params.get("vnp_TxnRef"))
                .vnpSecureHash(vnpSecureHash)
                .build();
    }

    public String handleIPN(Map<String, String> params) {
        try {
            String vnpSecureHash = params.get("vnp_SecureHash");
            params.remove("vnp_SecureHashType");
            params.remove("vnp_SecureHash");

            String signValue = vnPayConfiguration.hashAllFields(params);

            if (signValue.equals(vnpSecureHash)) {
                // Check order exists
                boolean checkOrderId = true; // TODO: Check in database
                boolean checkAmount = true; // TODO: Verify amount
                boolean checkOrderStatus = true; // TODO: Check status = PENDING

                if (checkOrderId) {
                    if (checkAmount) {
                        if (checkOrderStatus) {
                            if ("00".equals(params.get("vnp_ResponseCode"))) {
                                log.info("Payment successful for order: {}", params.get("vnp_TxnRef"));
                            } else {
                                log.warn("Payment failed for order: {}", params.get("vnp_TxnRef"));
                            }
                            return "{\"RspCode\":\"00\",\"Message\":\"Confirm Success\"}";
                        } else {
                            return "{\"RspCode\":\"02\",\"Message\":\"Order already confirmed\"}";
                        }
                    } else {
                        return "{\"RspCode\":\"04\",\"Message\":\"Invalid Amount\"}";
                    }
                } else {
                    return "{\"RspCode\":\"01\",\"Message\":\"Order not Found\"}";
                }
            } else {
                return "{\"RspCode\":\"97\",\"Message\":\"Invalid Checksum\"}";
            }
        } catch (Exception e) {
            log.error("Error processing IPN", e);
            return "{\"RspCode\":\"99\",\"Message\":\"Unknown error\"}";
        }
    }

    public String queryTransaction(PaymentQueryRequest request, HttpServletRequest httpRequest) throws Exception {
        String vnpRequestId = vnPayConfiguration.getRandomNumber(8);
        String vnpIpAddr = getIpAddress(httpRequest);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnpCreateDate = formatter.format(cld.getTime());

        com.nimbusds.jose.shaded.gson.JsonObject vnpParams = new com.nimbusds.jose.shaded.gson.JsonObject();
        vnpParams.addProperty("vnp_RequestId", vnpRequestId);
        vnpParams.addProperty("vnp_Version", vnPayConfiguration.getVnpVersion());
        vnpParams.addProperty("vnp_Command", "querydr");
        vnpParams.addProperty("vnp_TmnCode", vnPayConfiguration.getVnpTmnCode());
        vnpParams.addProperty("vnp_TxnRef", request.getOrderId());
        vnpParams.addProperty("vnp_OrderInfo", "Kiem tra ket qua GD OrderId:" + request.getOrderId());
        vnpParams.addProperty("vnp_TransactionDate", request.getTransactionDate());
        vnpParams.addProperty("vnp_CreateDate", vnpCreateDate);
        vnpParams.addProperty("vnp_IpAddr", vnpIpAddr);

        String hashData = String.join("|", vnpRequestId, vnPayConfiguration.getVnpVersion(), "querydr",
                vnPayConfiguration.getVnpTmnCode(), request.getOrderId(), request.getTransactionDate(),
                vnpCreateDate, vnpIpAddr, "Kiem tra ket qua GD OrderId:" + request.getOrderId());

        String vnpSecureHash = vnPayConfiguration.hmacSHA512(vnPayConfiguration.getSecretKey(), hashData);
        vnpParams.addProperty("vnp_SecureHash", vnpSecureHash);

        URL url = new URL(vnPayConfiguration.getVnpApiUrl());
        HttpURLConnection con = (HttpURLConnection) url.openConnection();
        con.setRequestMethod("POST");
        con.setRequestProperty("Content-Type", "application/json");
        con.setDoOutput(true);

        DataOutputStream wr = new DataOutputStream(con.getOutputStream());
        wr.writeBytes(vnpParams.toString());
        wr.flush();
        wr.close();

        BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
        String output;
        StringBuilder response = new StringBuilder();
        while ((output = in.readLine()) != null) {
            response.append(output);
        }
        in.close();

        log.info("Query response: {}", response.toString());
        return response.toString();
    }

    public String refundTransaction(VNPayRefundRequest request, HttpServletRequest httpRequest) throws Exception {
        String vnpRequestId = vnPayConfiguration.getRandomNumber(8);
        String vnpIpAddr = getIpAddress(httpRequest);

        long amount = request.getAmount() * 100;

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnpCreateDate = formatter.format(cld.getTime());

        com.nimbusds.jose.shaded.gson.JsonObject vnpParams = new com.nimbusds.jose.shaded.gson.JsonObject();
        vnpParams.addProperty("vnp_RequestId", vnpRequestId);
        vnpParams.addProperty("vnp_Version", vnPayConfiguration.getVnpVersion());
        vnpParams.addProperty("vnp_Command", "refund");
        vnpParams.addProperty("vnp_TmnCode", vnPayConfiguration.getVnpTmnCode());
        vnpParams.addProperty("vnp_TransactionType", request.getTransactionType());
        vnpParams.addProperty("vnp_TxnRef", request.getOrderId());
        vnpParams.addProperty("vnp_Amount", String.valueOf(amount));
        vnpParams.addProperty("vnp_OrderInfo", "Hoan tien GD OrderId:" + request.getOrderId());
        vnpParams.addProperty("vnp_TransactionDate", request.getTransactionDate());
        vnpParams.addProperty("vnp_CreateBy", request.getCreatedBy());
        vnpParams.addProperty("vnp_CreateDate", vnpCreateDate);
        vnpParams.addProperty("vnp_IpAddr", vnpIpAddr);

        String hashData = String.join("|", vnpRequestId, vnPayConfiguration.getVnpVersion(), "refund",
                vnPayConfiguration.getVnpTmnCode(), request.getTransactionType(), request.getOrderId(),
                String.valueOf(amount), "", request.getTransactionDate(), request.getCreatedBy(),
                vnpCreateDate, vnpIpAddr, "Hoan tien GD OrderId:" + request.getOrderId());

        String vnpSecureHash = vnPayConfiguration.hmacSHA512(vnPayConfiguration.getSecretKey(), hashData);
        vnpParams.addProperty("vnp_SecureHash", vnpSecureHash);

        URL url = new URL(vnPayConfiguration.getVnpApiUrl());
        HttpURLConnection con = (HttpURLConnection) url.openConnection();
        con.setRequestMethod("POST");
        con.setRequestProperty("Content-Type", "application/json");
        con.setDoOutput(true);

        DataOutputStream wr = new DataOutputStream(con.getOutputStream());
        wr.writeBytes(vnpParams.toString());
        wr.flush();
        wr.close();

        BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
        String output;
        StringBuilder response = new StringBuilder();
        while ((output = in.readLine()) != null) {
            response.append(output);
        }
        in.close();

        log.info("Refund response: {}", response.toString());
        return response.toString();
    }

    private String getIpAddress(HttpServletRequest request) {
        String ipAddress;
        try {
            ipAddress = request.getHeader("X-FORWARDED-FOR");
            if (ipAddress == null) {
                ipAddress = request.getRemoteAddr();
            }
        } catch (Exception e) {
            ipAddress = "Invalid IP:" + e.getMessage();
        }
        return ipAddress;
    }
}