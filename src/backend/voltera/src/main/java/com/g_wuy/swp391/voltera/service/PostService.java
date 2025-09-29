package com.g_wuy.swp391.voltera.service;

import com.g_wuy.swp391.voltera.entity.*;
import com.g_wuy.swp391.voltera.mapper.PostMapper;
import com.g_wuy.swp391.voltera.model.dto.BatteryDTO;
import com.g_wuy.swp391.voltera.model.dto.request.PostRequest;
import com.g_wuy.swp391.voltera.model.dto.response.PostResponse;
import com.g_wuy.swp391.voltera.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final BatteryRepository batteryRepository;
    private final BatterytypeRepository batterytypeRepository;
    private final BatteryimageRepository batteryimageRepository;
    private final AccountRepository accountRepository;
    private final S3Service s3Service;
    private final PostMapper postMapper;

    public PostResponse createPost(PostRequest dto, String username) throws IOException {

        Account account = accountRepository.findByUsername(username);
        if (!"seller".equalsIgnoreCase(account.getRole())) {
            throw new SecurityException("Only sellers can create posts");
        }
        User seller = account.getUser();

        Post post = postRepository.save(Post.builder()
                .sellerId(seller)
                .title(dto.getTitle())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .status(dto.getStatus() != null ? dto.getStatus() : "pending")
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build()
        );


        BatteryDTO b = dto.getBattery();
        Battery savedBattery = batteryRepository.save(Battery.builder()
                .post(post)
                .batteryTypeId(batterytypeRepository.findBatterytypeById(b.getBatteryTypeId()))
                .serialNumber(b.getSerialNumber())
                .originCapacity(b.getOriginCapacity())
                .remainingCapacity(b.getRemainingCapacity())
                .mileageCovered(b.getMileageCovered())
                .voltage(b.getVoltage())
                .cycleCount(b.getCycleCount())
                .warranty(b.getWarranty())
                .weight(b.getWeight())
                .lifeCycle(b.getLifeCycle())
                .build()
        );
        List<String> imageUrls = new ArrayList<>();
        if (dto.getImages() != null) {
            for (var file : dto.getImages()) {
                String url = s3Service.uploadFile(file);
                batteryimageRepository.save(Batteryimage.builder()
                        .battery(savedBattery)
                        .imageUrl(url)
                        .uploadedAt(Instant.now())
                        .build() );
                imageUrls.add(url);
            }
        }
        return postMapper.toPostResponse(post, savedBattery, imageUrls);
    }


}
