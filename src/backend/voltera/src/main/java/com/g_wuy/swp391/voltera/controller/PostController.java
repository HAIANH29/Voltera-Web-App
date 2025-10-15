package com.g_wuy.swp391.voltera.controller;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.g_wuy.swp391.voltera.entity.Post;
import com.g_wuy.swp391.voltera.model.request.FilterRequest;
import com.g_wuy.swp391.voltera.model.request.PostRequest;
import com.g_wuy.swp391.voltera.model.request.RejectRequest;
import com.g_wuy.swp391.voltera.model.response.ModerationResponse;
import com.g_wuy.swp391.voltera.model.response.PostResponse;
import com.g_wuy.swp391.voltera.model.response.RejectResponse;
import com.g_wuy.swp391.voltera.service.JwtService;
import com.g_wuy.swp391.voltera.service.PostService;

import java.io.IOException;
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
    public List<Post> getAllPost(@PathVariable("status") String status) {
        return postService.getPostByStatus(status);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/approve/{postId}")
    public ModerationResponse approvePost(@PathVariable Integer postId) {
        return postService.approvePost(postId);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/reject/{postId}")
    public RejectResponse rejectPost(@PathVariable Integer postId,
                                     @RequestBody RejectRequest request) {
        return postService.rejectPost(postId, request);
    }
    
    @PostMapping("/filter/vehicle")
    public ResponseEntity<List<Post>> filterPosts(@RequestBody FilterRequest request) {
        List<Post> result = postService.filterVehicle(request);
        return ResponseEntity.ok(result);
    }
}