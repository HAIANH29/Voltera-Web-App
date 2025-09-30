// controller/ModerationController.java
package com.g_wuy.swp391.voltera.controller;

import com.g_wuy.swp391.voltera.entity.Post;
import com.g_wuy.swp391.voltera.model.dto.request.ModerationRequest;
import com.g_wuy.swp391.voltera.model.dto.response.ModerationResponse;
import com.g_wuy.swp391.voltera.service.ModerationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/moderation")
@RequiredArgsConstructor
public class ModerationController {

    private final ModerationService moderationService;

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Post>> getPendingPosts() {
        return ResponseEntity.ok(moderationService.getPendingPosts());
    }

    @PutMapping("/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ModerationResponse> approvePost(@RequestBody ModerationRequest request) {
        return ResponseEntity.ok(moderationService.approvePost(request));
    }

    @PutMapping("/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ModerationResponse> rejectPost(@RequestParam Integer postId, @RequestParam String reason) {
        return ResponseEntity.ok(moderationService.rejectPost(postId, reason));
    }
}