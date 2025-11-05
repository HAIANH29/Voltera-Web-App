package com.g_wuy.swp391.voltera.controller;

import com.g_wuy.swp391.voltera.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/upload")
public class UploadController {
    @Autowired
    private S3Service s3Service;
    @Autowired
    private UserService userService;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private ContractService contractService;
    @Autowired
    private ComplaintImageService complaintImageService;

    @PostMapping("/product")
    public ResponseEntity<List<String>> uploadFiles(
            @RequestParam("files") MultipartFile[] files,
            @RequestParam(value = "folder", defaultValue = "general") String folderName) {
        List<String> urls = new ArrayList<>();
        try {
            for (MultipartFile file : files) {
                String url = s3Service.uploadFile(file, folderName);
                urls.add(url);
            }
            return ResponseEntity.ok(urls);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @PostMapping("/avatar")
    public ResponseEntity<String> uploadAvatar(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("file") MultipartFile file) {

        try {
            String token = authHeader.substring(7);
            String username = jwtService.extractUsername(token);

            String avatarUrl = s3Service.uploadFile(file, "avatar");

            userService.updateAvatar(username, avatarUrl);

            return ResponseEntity.ok(avatarUrl);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Upload avatar failed: " + e.getMessage());
        }
    }
    @PostMapping("/contract/{id}/upload-pdf")
    public ResponseEntity<ContractResponse> uploadPdf(
            @PathVariable Integer id,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(contractService.uploadPdf(id, file));
    }

    @PostMapping("/{complaintId}/images")
    public ResponseEntity<List<String>> uploadComplaintImages(
            @PathVariable Integer complaintId,
            @RequestParam("files") MultipartFile[] files) {
        List<String> urls = complaintImageService.uploadComplaintImages(complaintId, files);
        return ResponseEntity.ok(urls);
    }
}