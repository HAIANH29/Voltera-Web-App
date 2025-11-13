package com.g_wuy.swp391.voltera.service;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
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
import java.util.HashMap;
import java.util.Map;
import java.time.Instant;
import java.time.LocalDateTime;
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
    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private FeeRepository feeRepository;

    @Transactional
    public PostResponse createPost(PostRequest dto, String username) {
        //Lấy account và kiểm tra quyền
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new AccessDeniedException("Account not found"));

        if (!"SELLER".equalsIgnoreCase(account.getRole())) {
            throw new SecurityException("Only sellers can create posts");
        }

        User seller = Optional.ofNullable(account.getUser())
                .orElseThrow(() -> new SecurityException("Seller information not found"));

        //Tạo Post trước
        Post post = Post.builder()
                .sellerId(seller)
                .title(dto.getTitle())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .status("PENDING")
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        postRepository.save(post);
        postRepository.flush(); // Quan trọng với @MapsId — đảm bảo có post.id

        // Kiểm tra chỉ được chọn 1 trong 2: vehicle hoặc battery
        if (dto.getVehicle() != null && dto.getBattery() != null) {
            throw new IllegalArgumentException("Choose either a vehicle or a battery, not both.");
        }
        if (dto.getVehicle() == null && dto.getBattery() == null) {
            throw new IllegalArgumentException("Provide either vehicle or battery details.");
        }

        Battery savedBattery = null;
        Vehicle savedVehicle = null;
        List<String> allImages = new ArrayList<>();

        // ================= VEHICLE =================
        if (dto.getVehicle() != null) {
            if (vehicleRepository.isLicensePlateExist(dto.getVehicle().getLicensePlate())) {
                throw new BusinessException("This License Plate already exists");
            }

            savedVehicle = vehicleRepository.save(Vehicle.builder()
                    .post(post)
                    .brand(dto.getVehicle().getBrand())
                    .model(dto.getVehicle().getModel())
                    .version(dto.getVehicle().getVersion())
                    .odo(dto.getVehicle().getOdo())
                    .batteryCapacity(dto.getVehicle().getBatteryCapacity())
                    .range(dto.getVehicle().getRange())
                    .chargingTime(dto.getVehicle().getChargingTime())
                    .color(dto.getVehicle().getColor())
                    .numberOfSeat(dto.getVehicle().getNumberOfSeat())
                    .style(dto.getVehicle().getStyle())
                    .bodyInsurance(Boolean.TRUE.equals(dto.getVehicle().getBodyInsurance()))
                    .vehicleInspection(Boolean.TRUE.equals(dto.getVehicle().getVehicleInspection()))
                    .licensePlate(dto.getVehicle().getLicensePlate())
                    .origin(dto.getVehicle().getOrigin())
                    .status("AVAILABLE")
                    .yearManufacture(dto.getVehicle().getYearManufacture())
                    .build());

            //Lưu ảnh xe (nếu có)
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

        // ================= BATTERY =================
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
                    .lifecycle(dto.getBattery().getLifecycle())
                    .status("AVAILABLE")
                    .build());

            //Lưu ảnh pin (nếu có)
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
        }

        //Tạo transaction thanh toán phí đăng bài

        BigDecimal price = BigDecimal.valueOf(0.0);
        if (dto.getBattery() != null) {
            price = BigDecimal.valueOf(200000);
        }
        else if (dto.getVehicle() != null) {
            price = BigDecimal.valueOf(500000);
        }

        Transaction transaction = Transaction.builder()
                .post(post)
                .createAt(Instant.now())
                .updateAt(Instant.now())
                .price(price)
                .contractid(null)
                .reportid(null)
                .transactionStatus("PENDING")
                .buyerid(seller)
                .build();
        transactionRepository.save(transaction);

        //Chuẩn bị response
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
        post.setUpdatedAt(Instant.now()); // 🔥 Update timestamp when approving
        postRepository.save(post);
        System.out.println("✅ Post " + postId + " approved and status changed to APPROVE");
        return new ModerationResponse(post.getId(), post.getStatus(), null);
    }

    public RejectResponse rejectPost(Integer postId, RejectPostRequest request) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        // Find and refund the paid fee
        List<Fee> fees = feeRepository.findAll().stream()
            .filter(f -> f.getPost() != null && f.getPost().getId().equals(postId))
            .filter(f -> "PAID".equals(f.getFeeStatus()))
            .toList();
        
        for (Fee fee : fees) {
            // Change fee status to CANCELLED to remove it from total revenue
            fee.setFeeStatus("CANCELLED");
            feeRepository.save(fee);
            System.out.println("Fee refunded for rejected post ID: " + postId + 
                             ", amount: " + fee.getAmount());
        }
        
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
            
            // Get fee status for this post
            try {
                // Get the most recent fee for this post
                List<Fee> fees = feeRepository.findFeesByPostIdOrderByCreatedAtDesc(post.getId());
                if (!fees.isEmpty()) {
                    response.setFeeStatus(fees.get(0).getFeeStatus());
                } else {
                    response.setFeeStatus("PENDING"); // Default to PENDING if no fee record exists
                }
            } catch (Exception e) {
                System.out.println("Error getting fee for post " + post.getId() + ": " + e.getMessage());
                response.setFeeStatus("PENDING"); // Default to PENDING on error
            }
            
            responses.add(response);
        }

        return responses;
    }

    public List<PostResponse> getPendingPostsWithPaidFee() {
        try {
            // 🔥 NEW: Thử method chính trước
            List<Post> posts = postRepository.getPendingPostsWithPaidFee();
            System.out.println("🔍 Found " + posts.size() + " posts with PENDING status and PAID fee");
            
            // 🔥 NEW: Nếu không có, thử lấy tất cả posts có fee PAID
            if (posts.isEmpty()) {
                System.out.println("⚠️ No PENDING posts found, checking all posts with PAID fees...");
                List<Post> allPaidPosts = postRepository.getPostsWithPaidFee();
                System.out.println("🔍 Found " + allPaidPosts.size() + " total posts with PAID fees");
                
                // Lọc chỉ lấy PENDING posts
                posts = allPaidPosts.stream()
                    .filter(p -> "PENDING".equals(p.getStatus()))
                    .collect(java.util.stream.Collectors.toList());
                System.out.println("🔍 Filtered to " + posts.size() + " PENDING posts");
            }
            
            List<PostResponse> responses = new ArrayList<>();

            for (Post post : posts) {
                System.out.println("📝 Processing post ID: " + post.getId() + ", Status: " + post.getStatus());
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
                
                // 🔥 Lấy fee status cho post này
                try {
                    Fee fee = feeRepository.findFeeByPostId(post.getId());
                    if (fee != null) {
                        response.setFeeStatus(fee.getFeeStatus());
                        System.out.println("💰 Post " + post.getId() + " - Fee Status: " + fee.getFeeStatus());
                    } else {
                        response.setFeeStatus("NOT_PAID");
                        System.out.println("❌ Post " + post.getId() + " - No fee found, setting NOT_PAID");
                    }
                } catch (Exception e) {
                    response.setFeeStatus("UNKNOWN");
                    System.out.println("⚠️ Post " + post.getId() + " - Error getting fee: " + e.getMessage());
                }
                
                responses.add(response);
            }
            
            System.out.println("✅ Returning " + responses.size() + " post responses");
            return responses;
            
        } catch (Exception e) {
            System.err.println("❌ Error in getPendingPostsWithPaidFee: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public List<PostResponse> getAllVehiclePosts() {
        List<Post> posts = postRepository.findAllVehiclePosts();
        List<PostResponse> responses = new ArrayList<>();

        for (Post post : posts) {
            Vehicle vehicle = vehicleRepository.findByPost(post).orElse(null);
            List<String> imageUrls = new ArrayList<>();

            if (vehicle != null) {
                imageUrls = vehicleImageRepository.findByVehicle(vehicle)
                        .stream().map(VehicleImage::getImageUrl).toList();
            }

            PostResponse response = postMapper.toPostResponse(post, null, vehicle, imageUrls);
            response.setLocation(post.getSellerId().getAddress());
            responses.add(response);
        }
        return responses;
    }


    public List<PostResponse> getAllBatteryPosts() {
        List<Post> posts = postRepository.findAllBatteryPosts();
        List<PostResponse> responses = new ArrayList<>();

        for (Post post : posts) {
            Battery battery = batteryRepository.findByPost(post).orElse(null);
            List<String> imageUrls = new ArrayList<>();

            if (battery != null) {
                imageUrls = batteryImageRepository.findByBattery(battery)
                        .stream().map(BatteryImage::getImageUrl).toList();
            }

            PostResponse response = postMapper.toPostResponse(post, battery, null, imageUrls);
            response.setLocation(post.getSellerId().getAddress());
            responses.add(response);
        }
        return responses;
    }
    public PostResponse getPostDetail(Integer postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Battery battery = batteryRepository.findByPost(post).orElse(null);
        Vehicle vehicle = vehicleRepository.findByPost(post).orElse(null);

        List<String> imageUrls = new ArrayList<>();

        if (vehicle != null) {
            imageUrls = vehicleImageRepository.findByVehicle(vehicle)
                    .stream().map(VehicleImage::getImageUrl).toList();
        } else if (battery != null) {
            imageUrls = batteryImageRepository.findByBattery(battery)
                    .stream().map(BatteryImage::getImageUrl).toList();
        }

        PostResponse response = postMapper.toPostResponse(post, battery, vehicle, imageUrls);
        response.setLocation(post.getSellerId().getAddress());

        return response;
    }

    public List<PostResponse> getPostsByUserId(Integer userId) {
        List<Post> posts = postRepository.findBySellerIdIdOrderByCreatedAtDesc(userId);
        List<PostResponse> responses = new ArrayList<>();

        for (Post post : posts) {
            Vehicle vehicle = vehicleRepository.findByPost(post).orElse(null);
            Battery battery = batteryRepository.findByPost(post).orElse(null);
            List<String> imageUrls = new ArrayList<>();

            if (vehicle != null) {
                imageUrls = vehicleImageRepository.findByVehicle(vehicle)
                        .stream().map(VehicleImage::getImageUrl).toList();
            } else if (battery != null) {
                imageUrls = batteryImageRepository.findByBattery(battery)
                        .stream().map(BatteryImage::getImageUrl).toList();
            }

            PostResponse response = postMapper.toPostResponse(post, battery, vehicle, imageUrls);
            response.setLocation(post.getSellerId().getAddress());
            responses.add(response);
        }
        return responses;
    }

    // 🔥 DEBUG: Method chi tiết để kiểm tra dữ liệu
    public Map<String, Object> debugFeesData() {
        Map<String, Object> debugInfo = new HashMap<>();
        
        try {
            // 1. Kiểm tra tất cả posts PENDING
            List<Post> allPendingPosts = postRepository.findByStatus("PENDING");
            debugInfo.put("totalPendingPosts", allPendingPosts.size());
            System.out.println("📊 Total PENDING posts: " + allPendingPosts.size());
            
            // 2. Kiểm tra tất cả fees
            List<Fee> allFees = feeRepository.findAll();
            long paidFees = allFees.stream().filter(f -> "PAID".equals(f.getFeeStatus())).count();
            debugInfo.put("totalFees", allFees.size());
            debugInfo.put("paidFees", paidFees);
            System.out.println("💰 Total fees: " + allFees.size() + ", PAID: " + paidFees);
            
            // 3. Chi tiết fees PAID
            List<Fee> paidFeeList = allFees.stream()
                .filter(f -> "PAID".equals(f.getFeeStatus()))
                .collect(java.util.stream.Collectors.toList());
            
            List<Map<String, Object>> paidFeeDetails = new ArrayList<>();
            for (Fee fee : paidFeeList) {
                Map<String, Object> feeDetail = new HashMap<>();
                feeDetail.put("feeId", fee.getId());
                feeDetail.put("amount", fee.getAmount());
                feeDetail.put("postId", fee.getPost() != null ? fee.getPost().getId() : "NULL");
                feeDetail.put("postStatus", fee.getPost() != null ? fee.getPost().getStatus() : "NULL");
                feeDetail.put("postTitle", fee.getPost() != null ? fee.getPost().getTitle() : "NULL");
                paidFeeDetails.add(feeDetail);
                
                System.out.println("💳 Fee " + fee.getId() + " -> Post " + 
                    (fee.getPost() != null ? fee.getPost().getId() : "NULL") + 
                    " (Status: " + (fee.getPost() != null ? fee.getPost().getStatus() : "NULL") + ")");
            }
            debugInfo.put("paidFeeDetails", paidFeeDetails);
            
            // 4. Kiểm tra query kết quả
            List<Post> postsWithPaidFee = postRepository.getPendingPostsWithPaidFee();
            debugInfo.put("queryResult_PendingWithPaid", postsWithPaidFee.size());
            
            List<Post> allPostsWithPaidFee = postRepository.getPostsWithPaidFee();
            debugInfo.put("queryResult_AllWithPaid", allPostsWithPaidFee.size());
            
            System.out.println("🔍 Query results: PENDING+PAID=" + postsWithPaidFee.size() + 
                ", ALL+PAID=" + allPostsWithPaidFee.size());
                
        } catch (Exception e) {
            System.err.println("❌ Debug error: " + e.getMessage());
            debugInfo.put("error", e.getMessage());
        }
        
        return debugInfo;
    }

    // 🔥 NEW: Lấy tất cả posts đã thanh toán phí (để admin xem tổng quan)
    public List<PostResponse> getAllPostsWithPaidFee() {
        try {
            List<Post> posts = postRepository.getPostsWithPaidFee();
            System.out.println("🔍 getAllPostsWithPaidFee found: " + posts.size() + " posts");
            
            // Debug: In status của từng post
            Map<String, Long> statusCount = new HashMap<>();
            for (Post post : posts) {
                String status = post.getStatus();
                statusCount.put(status, statusCount.getOrDefault(status, 0L) + 1);
                System.out.println("📝 Post " + post.getId() + " - Status: " + status + " - Title: " + post.getTitle());
            }
            System.out.println("📊 Status distribution: " + statusCount);
            
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
                
                // 🔥 Lấy fee status cho post này
                try {
                    Fee fee = feeRepository.findFeeByPostId(post.getId());
                    if (fee != null) {
                        response.setFeeStatus(fee.getFeeStatus());
                        System.out.println("💰 Post " + post.getId() + " - Fee Status: " + fee.getFeeStatus());
                    } else {
                        response.setFeeStatus("NOT_PAID");
                        System.out.println("❌ Post " + post.getId() + " - No fee found, setting NOT_PAID");
                    }
                } catch (Exception e) {
                    response.setFeeStatus("UNKNOWN");
                    System.out.println("⚠️ Post " + post.getId() + " - Error getting fee: " + e.getMessage());
                }
                
                responses.add(response);
                
                System.out.println("📝 Post " + post.getId() + " - Status: " + post.getStatus() + " - FeeStatus: " + response.getFeeStatus() + " - Title: " + post.getTitle());
            }
            
            return responses;
        } catch (Exception e) {
            System.err.println("❌ Error in getAllPostsWithPaidFee: " + e.getMessage());
            return new ArrayList<>();
        }
    }
}