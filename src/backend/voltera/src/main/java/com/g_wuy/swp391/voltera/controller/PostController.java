// controller/PostController.java
package com.g_wuy.swp391.voltera.controller;

import com.g_wuy.swp391.voltera.model.dto.request.PostRequest;
import com.g_wuy.swp391.voltera.model.dto.response.PostResponse;
import com.g_wuy.swp391.voltera.service.JwtService;
import com.g_wuy.swp391.voltera.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;
    private final JwtService jwtService;

    @PostMapping
    public ResponseEntity<PostResponse> createPost(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody PostRequest dto) {
        try {
            String token = authHeader.substring(7);
            String username = jwtService.extractUsername(token);
            PostResponse response = postService.createPost(dto, username);
            return ResponseEntity.ok(response);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(null); // Forbidden
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null); // Bad Request
        } catch (IOException e) {
            return ResponseEntity.status(500).body(null); // Internal Server Error
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null); // Internal Server Error
        }
    }
}