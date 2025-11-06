package com.g_wuy.swp391.voltera.service;

import com.g_wuy.swp391.voltera.entity.Refund;
import com.g_wuy.swp391.voltera.entity.RefundImage;
import com.g_wuy.swp391.voltera.exception.BusinessException;
import com.g_wuy.swp391.voltera.repository.RefundImageRepository;
import com.g_wuy.swp391.voltera.repository.RefundRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
public class RefundImageService {

    @Autowired
    private RefundRepository refundRepository;

    @Autowired
    private RefundImageRepository refundImageRepository;

    @Autowired
    private S3Service s3Service;

    public List<String> uploadComplaintImages(Integer refundId, MultipartFile[] files) {
        Refund refund = refundRepository.findById(refundId)
                .orElseThrow(() -> new BusinessException("Complaint not found"));

        List<String> urls = new ArrayList<>();
        for (MultipartFile file : files) {
            String url = s3Service.uploadFile(file, "refund/" + refundId);
            RefundImage image = new RefundImage();
            image.setRefund(refund);
            image.setImageUrl(url);
            image.setUploadedAt(Instant.now());
            refundImageRepository.save(image);
            urls.add(url);
        }
        return urls;
    }
}