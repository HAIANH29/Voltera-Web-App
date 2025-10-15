package com.g_wuy.swp391.voltera.controller;

import com.g_wuy.swp391.voltera.service.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/upload")
public class UploadController {
    @Autowired
    private S3Service s3Service;

    @PostMapping("/product")
    public ResponseEntity<String> uploadProduct(@RequestParam("file") MultipartFile file,
                                                @RequestParam(value = "folder", defaultValue = "general") String folderName) {
        try {
            String fileUrl = s3Service.uploadFile(file, folderName);
            return ResponseEntity.ok(fileUrl);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Upload failed: " + e.getMessage());
        }
    }

}
