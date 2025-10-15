package com.g_wuy.swp391.voltera.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.g_wuy.swp391.voltera.entity.Post;
import com.g_wuy.swp391.voltera.model.request.FilterRequest;
import com.g_wuy.swp391.voltera.service.PostService;

@RestController("api/posts/filer")
public class FilterController {

    @Autowired
    private PostService postService;

    @PostMapping("vehicle")
    public ResponseEntity<List<Post>> filterPosts(@RequestBody FilterRequest request) {
        List<Post> result = postService.filterVehicle(request);
        return ResponseEntity.ok(result);
    }
}
