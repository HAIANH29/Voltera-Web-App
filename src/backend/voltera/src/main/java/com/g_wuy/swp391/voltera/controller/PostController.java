package com.g_wuy.swp391.voltera.controller;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.g_wuy.swp391.voltera.entity.Post;
import com.g_wuy.swp391.voltera.model.request.PostRequest;
import com.g_wuy.swp391.voltera.model.request.RejectPostRequest;
import com.g_wuy.swp391.voltera.model.response.ModerationResponse;
import com.g_wuy.swp391.voltera.model.response.PostResponse;
import com.g_wuy.swp391.voltera.model.response.RejectResponse;
import com.g_wuy.swp391.voltera.service.JwtService;
import com.g_wuy.swp391.voltera.service.PostService;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;



@RestController
@RequestMapping("/api/post")
public class PostController {

    @Autowired
    private PostService postService;
    @Autowired
    private JwtService jwtService;


    @PostMapping("/create")
    public ResponseEntity<PostResponse> createPost(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody PostRequest dto) throws IOException {

        String token = authHeader.substring(7);
        String username = jwtService.extractUsername(token);
        PostResponse response = postService.createPost(dto, username);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/list/{status}")
    public List<PostResponse> getAllPost(@PathVariable("status") String status) {
        return postService.getAllPost(status);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/post/{postId}/approve")
    public ModerationResponse approvePost(@PathVariable Integer postId) {
        return postService.approvePost(postId);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/post/{postId}/reject")
    public RejectResponse rejectPost(@PathVariable Integer postId,
                                     @RequestBody RejectPostRequest request) {
        return postService.rejectPost(postId, request);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/post/pending")
    public ResponseEntity<List<Post>> getPendingPosts() {
        return ResponseEntity.ok(postService.getPostByStatus("PENDING"));
    }

    @GetMapping("/filter/vehicles")
    public ResponseEntity<List<Post>> filterVehicles(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String address,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String version,
            @RequestParam(required = false) String color,
            @RequestParam(required = false) String origin,
            @RequestParam(required = false) String style,
            @RequestParam(required = false) Integer minOdo,
            @RequestParam(required = false) Integer maxOdo,
            @RequestParam(required = false) Integer minRange,
            @RequestParam(required = false) Integer maxRange,
            @RequestParam(required = false) Boolean bodyInsurance,
            @RequestParam(required = false) Boolean vehicleInspection,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Integer minYearManufacture,
            @RequestParam(required = false) Integer maxYearManufacture,
            @RequestParam(required = false) Integer numberOfSeat
    ) {
        List<Post> result = postService.filterVehicles(
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
        return ResponseEntity.ok(result);
    }

    @GetMapping("/filter/batteries")
    public ResponseEntity<List<Post>> filterBatteries(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String address,
            @RequestParam(required = false) String batteryType,
            @RequestParam(required = false) String serialNumber,
            @RequestParam(required = false) BigDecimal minOriginCapacity,
            @RequestParam(required = false) BigDecimal maxOriginCapacity,
            @RequestParam(required = false) BigDecimal minRemainingCapacity,
            @RequestParam(required = false) BigDecimal maxRemainingCapacity,
            @RequestParam(required = false) Integer minMileageCovered,
            @RequestParam(required = false) Integer maxMileageCovered,
            @RequestParam(required = false) BigDecimal minVoltage,
            @RequestParam(required = false) BigDecimal maxVoltage,
            @RequestParam(required = false) Integer minCycleCount,
            @RequestParam(required = false) Integer maxCycleCount,
            @RequestParam(required = false) String warranty,
            @RequestParam(required = false) BigDecimal minWeight,
            @RequestParam(required = false) BigDecimal maxWeight,
            @RequestParam(required = false) String lifeCycle,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice
    ) {
        List<Post> result = postService.filterBatteries(
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

        return ResponseEntity.ok(result);
    }

}