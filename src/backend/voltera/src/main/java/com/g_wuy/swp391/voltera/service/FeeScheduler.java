package com.g_wuy.swp391.voltera.service;

import com.g_wuy.swp391.voltera.entity.Fee;
import com.g_wuy.swp391.voltera.entity.Post;
import com.g_wuy.swp391.voltera.entity.User;
import com.g_wuy.swp391.voltera.repository.FeeRepository;
import com.g_wuy.swp391.voltera.repository.PostRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FeeScheduler {

    @Autowired
    private FeeRepository feeRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private EmailService emailService;

    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void scheduled() {
        LocalDateTime oneMonthAgo = LocalDateTime.now().minusDays(15);

        List<Fee> expiredFees = feeRepository.findByCreatedAtBeforeAndFeeStatus(oneMonthAgo, "PAID");

        for (Fee fee : expiredFees) {
            fee.setFeeStatus("PENDING");
            feeRepository.save(fee);

            Post post = fee.getPost();
            if (post != null) {
                User seller = post.getSellerId();
                if (seller != null && seller.getEmail() != null) {
                    emailService.sendEmailRenewalFee(seller.getEmail(), fee.getId());
                }
                post.setStatus("PENDING");
                postRepository.save(post);
            }
        }
    }
}