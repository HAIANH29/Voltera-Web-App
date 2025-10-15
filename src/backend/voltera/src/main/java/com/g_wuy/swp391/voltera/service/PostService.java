package com.g_wuy.swp391.voltera.service;

import com.g_wuy.swp391.voltera.model.request.FilterRequest;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.g_wuy.swp391.voltera.entity.*;
import com.g_wuy.swp391.voltera.exception.BusinessException;
import com.g_wuy.swp391.voltera.mapper.PostMapper;
import com.g_wuy.swp391.voltera.model.request.PostRequest;
import com.g_wuy.swp391.voltera.model.request.RejectRequest;
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
import jakarta.persistence.criteria.Predicate;

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

    public PostResponse createPost(PostRequest dto, String username) throws IOException {
        // 1. Xác thực seller
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException("Account not found"));

        if (!"SELLER".equalsIgnoreCase(account.getRole())) {
            throw new SecurityException("Only sellers can create posts");
        }

        User seller = Optional.ofNullable(account.getUser())
                .orElseThrow(() -> new SecurityException("Seller information not found"));

        // 2. Tạo Post
        Post post = postRepository.save(Post.builder()
                .sellerId(seller)
                .title(dto.getTitle())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .status("PENDING")
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build());

        // 3. Xử lý Vehicle hoặc Battery
        if (dto.getVehicle() != null && dto.getBattery() != null) {
            throw new IllegalArgumentException("Choose either a vehicle or a battery, not both.");
        }

        Battery savedBattery = null;
        Vehicle savedVehicle = null;
        List<String> allImages = new ArrayList<>();

        if (dto.getVehicle() != null) {
            if (vehicleRepository.isLicensePlateExist(dto.getVehicle().getLicenseplate())) {
                throw new BusinessException("This License Plate is already exists");
            }
            // Vehicle
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

        } else if (dto.getBattery() != null) {
            // Battery
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

        } else {
            throw new IllegalArgumentException("Provide either vehicle or battery details.");
        }

        // 4. Trả về response
        return postMapper.toPostResponse(post, savedBattery, savedVehicle, allImages);
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

    public RejectResponse rejectPost(Integer postId, RejectRequest request) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setStatus("REJECT");

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String adminUsername = auth != null ? auth.getName() : "Unknown";

        postRepository.save(post);
        return postMapper.toRejectResponse(post, adminUsername, request.getReason());
    }

    public List<Post> filterVehicle(FilterRequest request) {
        Specification<Post> specification = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            Join<Post, Vehicle> vehicleJoin = root.join("vehicle", JoinType.INNER);
            Join<Post, User> userJoin = root.join("sellerId", JoinType.INNER);
            if (request.getKeyword() != null || !request.getKeyword().equals("")) {
                predicates.add(cb.like(cb.lower(vehicleJoin.get("model")), "%" + request.getKeyword().toLowerCase() + "%"));
            }
            if (request.getAddress() != null && !request.getAddress().isEmpty()) {
                predicates.add(cb.like(cb.lower(userJoin.get("address")), "%" + request.getAddress() + "%"));
            }
            if (request.getBrand() != null || !request.getBrand().isEmpty()) {
                predicates.add(cb.like(cb.lower(vehicleJoin.get("brand")), "%" + request.getBrand() + "%"));
            }
            if (request.getColor() != null || !request.getColor().isEmpty()) {
                predicates.add(cb.equal(cb.lower(vehicleJoin.get("color")), request.getColor()));
            }
            if (request.getOrigin() != null || !request.getOrigin().isEmpty()) {
                predicates.add(cb.like(cb.lower(vehicleJoin.get("origin")), "%" + request.getOrigin() + "%"));
            }
            // style
            if (request.getStyle() != null && !request.getStyle().isEmpty()) {
                predicates.add(cb.like(cb.lower(vehicleJoin.get("style")), "%" + request.getStyle().toLowerCase() + "%"));
            }
            if (request.isBodyInsurance()) {
                predicates.add(cb.isTrue(vehicleJoin.get("bodyinsurance")));
            }
            if (request.isVehicleInspection()) {
                predicates.add(cb.isTrue(vehicleJoin.get("vehicleinspection")));
            }
            if (request.getMinPrice() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), request.getMinPrice()));
            }
            if (request.getMaxPrice() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), request.getMaxPrice()));
            }
            // year range
            if (request.getMinYearManufacture() > 0) {
                predicates.add(cb.greaterThanOrEqualTo(vehicleJoin.get("yearmanufacture"), request.getMinYearManufacture()));
            }
            if (request.getMaxYearManufacture() > 0) {
                predicates.add(cb.lessThanOrEqualTo(vehicleJoin.get("yearmanufacture"), request.getMaxYearManufacture()));
            }
            if (request.getNumberOfSeat() != null && request.getNumberOfSeat() > 0) {
                predicates.add(cb.equal(vehicleJoin.get("numberofseat"), request.getNumberOfSeat()));
            }
            predicates.add(cb.equal(vehicleJoin.get("status"), "AVAILABLE"));

            // Gộp tất cả điều kiện bằng AND
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return postRepository.findAll(specification);
    }
}