
 package com.g_wuy.swp391.voltera.controller;

 import com.g_wuy.swp391.voltera.model.request.PostRequest;
 import com.g_wuy.swp391.voltera.model.response.PostResponse;
 import com.g_wuy.swp391.voltera.service.JwtService;
 import com.g_wuy.swp391.voltera.service.PostService;
 import lombok.RequiredArgsConstructor;
 import org.springframework.http.ResponseEntity;
 import org.springframework.web.bind.annotation.*;

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
             @ModelAttribute PostRequest dto) throws IOException {

         String token = authHeader.substring(7);
         String username = jwtService.extractUsername(token);
         PostResponse response = postService.createPost(dto, username);
         return ResponseEntity.ok(response);
     }
 }