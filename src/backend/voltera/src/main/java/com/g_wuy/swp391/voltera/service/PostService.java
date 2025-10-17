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
import org.springframework.web.multipart.MultipartFile;

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

            // Keyword (model)
            if (request.getKeyword() != null && !request.getKeyword().isEmpty()) {
                predicates.add(cb.like(cb.lower(vehicleJoin.get("model")), "%" + request.getKeyword().toLowerCase() + "%"));
            }

            // Address (from User)
            if (request.getAddress() != null && !request.getAddress().isEmpty()) {
                predicates.add(cb.like(cb.lower(userJoin.get("address")), "%" + request.getAddress().toLowerCase() + "%"));
            }

            // Brand
            if (request.getBrand() != null && !request.getBrand().isEmpty()) {
                predicates.add(cb.like(cb.lower(vehicleJoin.get("brand")), "%" + request.getBrand().toLowerCase() + "%"));
            }

            // Version
            if (request.getVersion() != null && !request.getVersion().isEmpty()) {
                predicates.add(cb.like(cb.lower(vehicleJoin.get("version")), "%" + request.getVersion().toLowerCase() + "%"));
            }

            // Odo
            if (request.getMinOdo() != null && request.getMinOdo() > 0) {
                predicates.add(cb.greaterThanOrEqualTo(vehicleJoin.get("odo"), request.getMinOdo()));
            }
            if (request.getMaxOdo() != null && request.getMaxOdo() > 0) {
                predicates.add(cb.lessThanOrEqualTo(vehicleJoin.get("odo"), request.getMaxOdo()));
            }

            // Range
            if (request.getMinRange() != null && request.getMinRange() > 0) {
                predicates.add(cb.greaterThanOrEqualTo(vehicleJoin.get("range"), request.getMinRange()));
            }
            if (request.getMaxRange() != null && request.getMaxRange() > 0) {
                predicates.add(cb.lessThanOrEqualTo(vehicleJoin.get("range"), request.getMaxRange()));
            }

            // Color
            if (request.getColor() != null && !request.getColor().isEmpty()) {
                predicates.add(cb.equal(cb.lower(vehicleJoin.get("color")), request.getColor().toLowerCase()));
            }

            // Origin
            if (request.getOrigin() != null && !request.getOrigin().isEmpty()) {
                predicates.add(cb.like(cb.lower(vehicleJoin.get("origin")), "%" + request.getOrigin().toLowerCase() + "%"));
            }

            // Style
            if (request.getStyle() != null && !request.getStyle().isEmpty()) {
                predicates.add(cb.like(cb.lower(vehicleJoin.get("style")), "%" + request.getStyle().toLowerCase() + "%"));
            }

            // Body Insurance
            if (request.getBodyInsurance() != null && request.getBodyInsurance().describeConstable().isEmpty()) {
                predicates.add(cb.isTrue(vehicleJoin.get("bodyinsurance")));
            }

            // Vehicle Inspection
            if (request.getVehicleInspection() != null && request.getVehicleInspection().describeConstable().isEmpty()) {
                predicates.add(cb.isTrue(vehicleJoin.get("vehicleinspection")));
            }

            // Price
            if (request.getMinPrice() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), request.getMinPrice()));
            }
            if (request.getMaxPrice() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), request.getMaxPrice()));
            }

            // Year Manufacture (int → cần kiểm tra thủ công)
            if (request.getMinYearManufacture() > 0) {
                predicates.add(cb.greaterThanOrEqualTo(vehicleJoin.get("yearManufacture"), request.getMinYearManufacture()));
            }
            if (request.getMaxYearManufacture() > 0) {
                predicates.add(cb.lessThanOrEqualTo(vehicleJoin.get("yearManufacture"), request.getMaxYearManufacture()));
            }

            // Number of Seats
            if (request.getNumberOfSeat() != null && request.getNumberOfSeat() > 0) {
                predicates.add(cb.equal(vehicleJoin.get("numberofseat"), request.getNumberOfSeat()));
            }

            // Chỉ lấy xe AVAILABLE
            predicates.add(cb.equal(vehicleJoin.get("status"), "AVAILABLE"));

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return postRepository.findAll(specification);
    }

}