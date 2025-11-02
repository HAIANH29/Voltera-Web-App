package com.g_wuy.swp391.voltera.controller;

import com.g_wuy.swp391.voltera.entity.Complaint;
import com.g_wuy.swp391.voltera.model.request.ComplaintRequest;
import com.g_wuy.swp391.voltera.service.ComplaintService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    @PostMapping
    public ResponseEntity<Complaint> createComplaint(
            @Valid
            @RequestBody ComplaintRequest request,
            @RequestHeader("Authorization") String auth) {
        Complaint complaint = complaintService.createComplaint(request, auth);
        return ResponseEntity.ok(complaint);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Complaint>> getComplaintByStatus(
            @PathVariable String status,
            @RequestHeader("Authorization") String auth) {
        List<Complaint> complaints = complaintService.getComplaintByStatus(status, auth);
        return ResponseEntity.ok(complaints);
    }

    @GetMapping("/my-complaints")
    public ResponseEntity<List<Complaint>> viewMyComplaints(
            @RequestHeader("Authorization") String auth) {
        List<Complaint> complaints = complaintService.viewComplaintByUserId(auth);
        return ResponseEntity.ok(complaints);
    }

    @GetMapping("/{complaintId}")
    public ResponseEntity<Complaint> detailsComplaint(@PathVariable Integer complaintId) {
        return complaintService.detailComplaint(complaintId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}