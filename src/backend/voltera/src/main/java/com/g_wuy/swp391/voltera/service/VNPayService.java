package com.g_wuy.swp391.voltera.service;

import com.g_wuy.swp391.voltera.configuration.VNPayConfiguration;
import com.g_wuy.swp391.voltera.entity.*;
import com.g_wuy.swp391.voltera.model.request.VNPayRequest;
import com.g_wuy.swp391.voltera.model.response.PaymentPrepareResponse;
import com.g_wuy.swp391.voltera.model.response.VNPayRefundResponse;
import com.g_wuy.swp391.voltera.model.response.VNPayResponse;
import com.g_wuy.swp391.voltera.repository.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Calendar;
import java.util.Map;
import java.util.TimeZone;
import java.util.TreeMap;

@Service
@Transactional
@Slf4j
public class VNPayService {

    @Autowired
    private VNPayConfiguration vnPayConfig;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private FeeRepository feeRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private BatteryRepository batteryRepository;

    @Autowired
    private BankRepository bankRepository;

    @Autowired
    private BankTransferRepository bankTransferRepository;

    @Autowired
    private RefundRepository refundRepository;

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

            String createDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
            vnp_Params.put("vnp_CreateDate", createDate);

            StringBuilder hashData = new StringBuilder();
            StringBuilder query = new StringBuilder();
            for (Map.Entry<String, String> entry : vnp_Params.entrySet()) {
                if (hashData.length() > 0) hashData.append('&');
                hashData.append(entry.getKey()).append('=')
                        .append(URLEncoder.encode(entry.getValue(), StandardCharsets.US_ASCII));

                query.append(URLEncoder.encode(entry.getKey(), StandardCharsets.US_ASCII))
                        .append('=')
                        .append(URLEncoder.encode(entry.getValue(), StandardCharsets.US_ASCII))
                        .append('&');
            }

            String vnp_SecureHash = vnPayConfig.hmacSHA512(vnPayConfig.getSecretKey(), hashData.toString());
            String paymentUrl = vnPayConfig.getVnpPayUrl() + "?" + query + "vnp_SecureHash=" + vnp_SecureHash;

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

    public String handleReturn(Map<String, String> params, Integer transactionId, String token) {
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

            Fee fee = feeRepository.findByTransactionId(transactionId);

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
                fee.setFeeStatus("PAID");
                
                // Update vehicle status only once
                transaction.getPost().getVehicle().setStatus("SOLD");
                vehicleRepository.save(transaction.getPost().getVehicle());
                
                // Save battery only if it exists
                if (transaction.getPost().getBattery() != null) {
                    batteryRepository.save(transaction.getPost().getBattery());
                }
                //chuyển tiền cho seller
                User seller = transaction.getPost().getSellerId();
                Bank bankSeller = bankRepository.findBankByUserId(seller.getId());
                
                if (bankSeller != null) {
                    BigDecimal balance = bankSeller.getBalance() != null ? bankSeller.getBalance() : BigDecimal.ZERO;
                    bankSeller.setBalance(balance.add(amount));
                    bankRepository.save(bankSeller);
                } else {
                    log.warn("Seller {} has no bank account registered, skipping money transfer", seller.getId());
                }
                
                User buyer = transaction.getBuyerid();  // Get buyer directly from transaction
                
                // Only create bank transfer if seller has bank account
                if (bankSeller != null && buyer != null) {
                    //track lại giả lập ngân hàng
                    BankTransfer bankTransfer = BankTransfer.builder()
                            .payment(payment)
                            .transaction(transaction)
                            .seller(seller)
                            .bank(bankSeller)
                            .amount(amount)
                            .transferStatus("COMPLETED")
                            .initiatedAt(Instant.now())
                            .completedAt(Instant.now())
                            .description("Transfer from " + buyer.getFullname() + " in posting " + transaction.getPost().getTitle())
                            .build();
                    bankTransferRepository.save(bankTransfer);
                }
            } else {
                transaction.setTransactionStatus("FAILED");
                payment.setPaymentStatus("FAILED");
                fee.setFeeStatus("PENDING");
            }

            paymentRepository.save(payment);
            transactionRepository.save(transaction);
            feeRepository.save(fee);  // Save fee status changes
            notificationService.sendForEvent(payment);
            notificationService.sendForEvent(transaction);
            return "Giao dịch " + transaction.getTransactionStatus().toLowerCase() + "!";
        } catch (Exception e) {
            log.error("Error handling VNPay return", e);
            return "Lỗi xử lý callback: " + e.getMessage();
        }
    }

    public ResponseEntity<PaymentPrepareResponse> preparePayment(Integer transactionId, String jwt) {
        String token = jwt.substring(7);
        String username = jwtService.extractUsername(token);
        User user = userRepository.findUserByUsername(username);
        return paymentRepository.findPaymentByTransactionId(transactionId, user.getId());
    }

    public VNPayRefundResponse refund(HttpServletRequest httpRequest, Integer refundId) {
        try {
            String vnp_RequestId = VNPayConfiguration.getRandomNumber(8);
            String vnp_Version = "2.1.0";
            String vnp_Command = "refund";
            String vnp_TmnCode = vnPayConfig.getVnpTmnCode();
            String vnp_IpAddr = VNPayConfiguration.getIpAddress(httpRequest);

            String vnp_CreateDate = new SimpleDateFormat("yyyyMMddHHmmss")
                    .format(Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7")).getTime());

            String vnp_TransactionType = "02";
            String vnp_TxnRef = VNPayConfiguration.getRandomNumber(8);

            Refund refund = refundRepository.findById(refundId)
                    .orElseThrow(() -> new RuntimeException("Refund not found"));
            BigDecimal amount = refund.getAmount();

            Payment payment = paymentRepository.findPaymentByTransactionId(refund.getTransaction().getTransactionid());

            String vnp_TransactionNo = payment.getVnpTransactionNo();

            String vnp_OrderInfo = (refund.getReason() != null && !refund.getReason().isEmpty())
                    ? refund.getReason()
                    : "Refund for transaction " + refundId;

            String hashData = String.join("|",
                    vnp_RequestId,
                    vnp_Version,
                    vnp_Command,
                    vnp_TmnCode,
                    vnp_TransactionType,
                    vnp_TxnRef,
                    String.valueOf(amount.multiply(BigDecimal.valueOf(100)).intValue()),
                    vnp_TransactionNo,
                    vnp_CreateDate,
                    "",
                    vnp_CreateDate,
                    vnp_IpAddr,
                    vnp_OrderInfo
            );

            String vnp_SecureHash = vnPayConfig.hmacSHA512(vnPayConfig.getSecretKey(), hashData);

            com.nimbusds.jose.shaded.gson.JsonObject vnp_Params = new com.nimbusds.jose.shaded.gson.JsonObject();
            vnp_Params.addProperty("vnp_RequestId", vnp_RequestId);
            vnp_Params.addProperty("vnp_Version", vnp_Version);
            vnp_Params.addProperty("vnp_Command", vnp_Command);
            vnp_Params.addProperty("vnp_TmnCode", vnp_TmnCode);
            vnp_Params.addProperty("vnp_TransactionType", vnp_TransactionType);
            vnp_Params.addProperty("vnp_TxnRef", vnp_TxnRef);
            vnp_Params.addProperty("vnp_Amount", String.valueOf(amount.multiply(BigDecimal.valueOf(100)).intValue()));
            vnp_Params.addProperty("vnp_OrderInfo", vnp_OrderInfo);
            vnp_Params.addProperty("vnp_TransactionDate", vnp_CreateDate);
            vnp_Params.addProperty("vnp_CreateDate", vnp_CreateDate);
            vnp_Params.addProperty("vnp_IpAddr", vnp_IpAddr);
            vnp_Params.addProperty("vnp_SecureHash", vnp_SecureHash);

            URL url = new URL(vnPayConfig.getVnpApiUrl());
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("POST");
            con.setRequestProperty("Content-Type", "application/json");
            con.setDoOutput(true);

            try (DataOutputStream wr = new DataOutputStream(con.getOutputStream())) {
                wr.writeBytes(vnp_Params.toString());
                wr.flush();
            }

            BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = in.readLine()) != null) {
                response.append(line);
            }
            in.close();

            log.info("Refund response: {}", response);

            com.google.gson.JsonObject jsonResponse =
                    com.google.gson.JsonParser.parseString(response.toString()).getAsJsonObject();

            return VNPayRefundResponse.builder()
                    .code(jsonResponse.get("vnp_ResponseCode").getAsString())
                    .message(jsonResponse.get("vnp_Message").getAsString())
                    .responseId(jsonResponse.get("vnp_ResponseId").getAsString())
                    .txnRef(jsonResponse.get("vnp_TxnRef").getAsString())
                    .amount(jsonResponse.get("vnp_Amount").getAsString())
                    .bankCode(jsonResponse.get("vnp_BankCode").getAsString())
                    .transactionNo(jsonResponse.get("vnp_TransactionNo").getAsString())
                    .transactionStatus(jsonResponse.get("vnp_TransactionStatus").getAsString())
                    .build();

        } catch (Exception e) {
            log.error("Refund error", e);
            return VNPayRefundResponse.builder()
                    .code("99")
                    .message("Error: " + e.getMessage())
                    .build();
        }
    }
}