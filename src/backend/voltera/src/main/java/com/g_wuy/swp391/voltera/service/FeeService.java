package com.g_wuy.swp391.voltera.service;

import com.g_wuy.swp391.voltera.entity.Fee;
import com.g_wuy.swp391.voltera.entity.Post;
import com.g_wuy.swp391.voltera.entity.Transaction;
import com.g_wuy.swp391.voltera.model.request.VNPayRequest;
import com.g_wuy.swp391.voltera.model.response.VNPayResponse;
import com.g_wuy.swp391.voltera.repository.FeeRepository;
import com.g_wuy.swp391.voltera.repository.PostRepository;
import com.g_wuy.swp391.voltera.repository.TransactionRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class FeeService {
    @Autowired
    private FeeRepository feeRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private VNPayService vNPayService;

    public VNPayResponse createFeeAndPay(Integer postId, HttpServletRequest httpRequest) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // Tạo Fee cho bài post
        Fee fee = new Fee();
        fee.setPost(post);
        if (post.getVehicle() != null) {
            fee.setAmount(BigDecimal.valueOf(500000));
        }
        else {
            fee.setAmount(BigDecimal.valueOf(200000));
        }
        fee.setDescription("Fee for post:  " + post.getTitle());
        fee.setFeeStatus("VALID");
        fee.setCreatedAt(LocalDateTime.now());
        fee.setExpiredAt(LocalDateTime.now().plusSeconds(30L * 24 * 60 * 60));
        feeRepository.save(fee);

        // Tạo Transaction tương ứng
        Transaction transaction = new Transaction();
        transaction.setTransactionStatus("PENDING");
        transaction.setPrice(fee.getAmount());
        transactionRepository.save(transaction);

        // Gọi sang VNPay để tạo URL thanh toán
        VNPayRequest vnPayRequest = new VNPayRequest();

        return vNPayService.createPayment(vnPayRequest, httpRequest, transaction.getTransactionid().toString());
    }

    public VNPayResponse renewFee(Integer postId, HttpServletRequest httpRequest) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // Lấy Fee hiện tại (nếu có)
        Fee oldFee = feeRepository.findValidFeeByPostId(postId)
                .orElse(null);

        // Đánh dấu Fee cũ là hết hạn (nếu có)
        if (oldFee != null) {
            oldFee.setFeeStatus("EXPIRED");
            feeRepository.save(oldFee);
        }

        // Tạo Fee mới cho lần gia hạn
        Fee newFee = Fee.builder()
                .post(post)
                .amount(BigDecimal.valueOf(50000)) // phí gia hạn: 50.000 VNĐ
                .description("Gia hạn bài đăng: " + post.getTitle())
                .feeStatus("VALID")
                .createdAt(LocalDateTime.now())
                .expiredAt(LocalDateTime.now().plusSeconds(30L * 24 * 60 * 60)) // 30 ngày
                .build();
        feeRepository.save(newFee);

        // Tạo Transaction tương ứng
        Transaction transaction = new Transaction();
        transaction.setTransactionStatus("PENDING");
        transaction.setPrice(newFee.getAmount());
        transactionRepository.save(transaction);

        // Gọi sang VNPay để tạo URL thanh toán
        VNPayRequest vnPayRequest = VNPayRequest.builder()
                .amount(newFee.getAmount().longValue())
                .orderInfo("Gia hạn bài đăng: " + post.getTitle())
                .build();

        return vNPayService.createPayment(vnPayRequest, httpRequest, transaction.getTransactionid().toString());
    }
}
