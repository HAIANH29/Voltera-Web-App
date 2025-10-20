package com.g_wuy.swp391.voltera.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.g_wuy.swp391.voltera.entity.*;
import com.g_wuy.swp391.voltera.exception.BusinessException;
import com.g_wuy.swp391.voltera.mapper.PostMapper;
import com.g_wuy.swp391.voltera.model.request.PostRequest;
import com.g_wuy.swp391.voltera.model.request.RejectPostRequest;
import com.g_wuy.swp391.voltera.model.response.ModerationResponse;
import com.g_wuy.swp391.voltera.model.response.PostResponse;
import com.g_wuy.swp391.voltera.model.response.RejectResponse;
import com.g_wuy.swp391.voltera.repository.*;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;
    @Autowired
    private BatteryRepository batteryRepository;
    @Autowired
    private BatteryTypeRepository batteryTypeRepository;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private VehicleRepository vehicleRepository;
    @Autowired
    private PostMapper postMapper;
    @Autowired
    private VehicleImageRepository vehicleImageRepository;
    @Autowired
    private BatteryImageRepository batteryImageRepository;

    public PostResponse createPost(PostRequest dto, String username) throws IOException {


        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException("Account not found"));

        if (!"SELLER".equalsIgnoreCase(account.getRole())) {
            throw new SecurityException("Only sellers can create posts");
        }

        User seller = Optional.ofNullable(account.getUser())
                .orElseThrow(() -> new SecurityException("Seller information not found"));


        // 🔹 2. Tạo Post
        Post post = postRepository.save(Post.builder()
                .sellerId(seller)
                .title(dto.getTitle())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .status("PENDING")
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build());


        if (dto.getVehicle() != null && dto.getBattery() != null) {
            throw new IllegalArgumentException("Choose either a vehicle or a battery, not both.");
        }

        Battery savedBattery = null;
        Vehicle savedVehicle = null;
        List<String> allImages = new ArrayList<>();
        if (dto.getVehicle() != null) {
            if (vehicleRepository.isLicensePlateExist(dto.getVehicle().getLicenseplate())) {
                throw new BusinessException("This License Plate already exists");
            }

            savedVehicle = vehicleRepository.save(Vehicle.builder()
                    .post(post)
                    .brand(dto.getVehicle().getBrand())
                    .model(dto.getVehicle().getModel())
                    .version(dto.getVehicle().getVersion())
                    .odo(dto.getVehicle().getOdo())
                    .batteryCapacity(dto.getVehicle().getBatterycapacity())
                    .range(dto.getVehicle().getRange())
                    .chargingTime(dto.getVehicle().getChargingtime())
                    .color(dto.getVehicle().getColor())
                    .numberOfSeat(dto.getVehicle().getNumberofseat())
                    .style(dto.getVehicle().getStyle())
                    .bodyInsurance(Boolean.TRUE.equals(dto.getVehicle().getBodyinsurance()))
                    .vehicleInspection(Boolean.TRUE.equals(dto.getVehicle().getVehicleinspection()))
                    .licensePlate(dto.getVehicle().getLicenseplate())
                    .origin(dto.getVehicle().getOrigin())
                    .status("AVAILABLE")
                    .yearManufacture(dto.getVehicle().getYearmanufacture())
                    .build());

            // 🔹 Lưu URL ảnh xe
            if (dto.getVehicleImages() != null && !dto.getVehicleImages().isEmpty()) {
                for (String url : dto.getVehicleImages()) {
                    vehicleImageRepository.save(VehicleImage.builder()
                            .vehicle(savedVehicle)
                            .imageUrl(url)
                            .uploadedAt(Instant.now())
                            .build());
                }
                allImages.addAll(dto.getVehicleImages());
            }
        }

        // 🔹 Nếu là pin
        else if (dto.getBattery() != null) {
            Integer typeId = dto.getBattery().getBatteryTypeId().getId();
            if (typeId == null) throw new IllegalArgumentException("Battery type ID is required");

            BatteryType type = batteryTypeRepository.findById(typeId)
                    .orElseThrow(() -> new IllegalArgumentException("Battery type not found: " + typeId));

            if (batteryRepository.isSerialNumberExist(dto.getBattery().getSerialNumber())) {
                throw new BusinessException("This serial number already exists");
            }

            savedBattery = batteryRepository.save(Battery.builder()
                    .post(post)
                    .batteryTypeId(type)
                    .serialNumber(dto.getBattery().getSerialNumber())
                    .originCapacity(dto.getBattery().getOriginCapacity())
                    .remainingCapacity(dto.getBattery().getRemainingCapacity())
                    .mileageCovered(dto.getBattery().getMileageCovered())
                    .voltage(dto.getBattery().getVoltage())
                    .cycleCount(dto.getBattery().getCycleCount())
                    .warranty(dto.getBattery().getWarranty())
                    .weight(dto.getBattery().getWeight())
                    .lifecycle(dto.getBattery().getLifeCycle())
                    .build());


            if (dto.getBatteryImages() != null && !dto.getBatteryImages().isEmpty()) {
                for (String url : dto.getBatteryImages()) {
                    batteryImageRepository.save(BatteryImage.builder()
                            .battery(savedBattery)
                            .imageUrl(url)
                            .uploadedAt(Instant.now())
                            .build());
                }
                allImages.addAll(dto.getBatteryImages());
            }
        } else {
            throw new IllegalArgumentException("Provide either vehicle or battery details.");
        }
        PostResponse response = postMapper.toPostResponse(post, savedBattery, savedVehicle, allImages);
        response.setLocation(seller.getAddress());

        return response;

    }


    public List<Post> getPostByStatus(String status) {
        return postRepository.getAllPostByStatus(status);
    }

    public ModerationResponse approvePost(Integer postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setStatus("APPROVE");
        postRepository.save(post);
        return new ModerationResponse(post.getId(), post.getStatus(), null);
    }

    public RejectResponse rejectPost(Integer postId, RejectPostRequest request) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setStatus("REJECT");

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String adminUsername = auth != null ? auth.getName() : "Unknown";

        postRepository.save(post);
        return postMapper.toRejectResponse(post, adminUsername, request.getReason());
    }

    public List<Post> filterVehicles(
            String keyword,
            String address,
            String brand,
            String version,
            String color,
            String origin,
            String style,
            Integer minOdo,
            Integer maxOdo,
            Integer minRange,
            Integer maxRange,
            Boolean bodyInsurance,
            Boolean vehicleInspection,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Integer minYearManufacture,
            Integer maxYearManufacture,
            Integer numberOfSeat) {

        return postRepository.filterVehicles(
                keyword,
                address,
                brand,
                version,
                color,
                origin,
                style,
                minOdo,
                maxOdo,
                minRange,
                maxRange,
                bodyInsurance,
                vehicleInspection,
                minPrice,
                maxPrice,
                minYearManufacture,
                maxYearManufacture,
                numberOfSeat
        );
    }


    public List<Post> filterBatteries(
            String keyword,
            String address,
            String batteryType,
            String serialNumber,
            BigDecimal minOriginCapacity,
            BigDecimal maxOriginCapacity,
            BigDecimal minRemainingCapacity,
            BigDecimal maxRemainingCapacity,
            Integer minMileageCovered,
            Integer maxMileageCovered,
            BigDecimal minVoltage,
            BigDecimal maxVoltage,
            Integer minCycleCount,
            Integer maxCycleCount,
            String warranty,
            BigDecimal minWeight,
            BigDecimal maxWeight,
            String lifeCycle,
            BigDecimal minPrice,
            BigDecimal maxPrice) {

        return postRepository.filterBatteries(
                keyword,
                address,
                batteryType,
                serialNumber,
                minOriginCapacity,
                maxOriginCapacity,
                minRemainingCapacity,
                maxRemainingCapacity,
                minMileageCovered,
                maxMileageCovered,
                minVoltage,
                maxVoltage,
                minCycleCount,
                maxCycleCount,
                warranty,
                minWeight,
                maxWeight,
                lifeCycle,
                minPrice,
                maxPrice
        );
    }

    public List<PostResponse> getAllPost(String status) {
        List<Post> posts = postRepository.getAllPostByStatus(status);
        List<PostResponse> responses = new ArrayList<>();

        for (Post post : posts) {
            List<String> allImages = new ArrayList<>();
            Vehicle vehicle = vehicleRepository.findByPost(post).orElse(null);
            Battery battery = batteryRepository.findByPost(post).orElse(null);

            if (vehicle != null) {
                List<String> vImages = vehicleImageRepository.findByVehicle(vehicle)
                        .stream().map(VehicleImage::getImageUrl).toList();
                allImages.addAll(vImages);
            }

            if (battery != null) {
                List<String> bImages = batteryImageRepository.findByBattery(battery)
                        .stream().map(BatteryImage::getImageUrl).toList();
                allImages.addAll(bImages);
            }

            PostResponse response = postMapper.toPostResponse(post, battery, vehicle, allImages);
            response.setLocation(post.getSellerId().getAddress());
            responses.add(response);
        }

        return responses;
    }
}