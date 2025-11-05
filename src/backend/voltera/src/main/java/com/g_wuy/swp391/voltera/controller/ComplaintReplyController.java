package com.g_wuy.swp391.voltera.controller;

import com.g_wuy.swp391.voltera.entity.ComplaintReply;
import com.g_wuy.swp391.voltera.model.request.ReplyComplaintRequest;
import com.g_wuy.swp391.voltera.service.ComplaintReplyService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reply-complaint")
public class ComplaintReplyController {

    @Autowired
    private ComplaintReplyService complaintReplyService;

    @PostMapping("/create-reply/{complaintId}")
    public ResponseEntity<ComplaintReply> createComplaint(
            @Valid
            @PathVariable("complaintId") Integer complaintId,
            @RequestBody ReplyComplaintRequest request,
            @RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(complaintReplyService.replyComplaint(request, complaintId, token).getBody());
    }

    @GetMapping("/my-complaint")
    public ResponseEntity<List<ComplaintReplyResponse>> getMyComplaint(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(complaintReplyService.myReplyComplaint(token).getBody());
    }

    @GetMapping("/unresolve")
    public ResponseEntity<List<ComplaintResponse>> listComplaintNotResolve() {
        return ResponseEntity.ok(complaintReplyService.listComplaintNotResolve().getBody());
    }

    @GetMapping("/search")
    public ResponseEntity<List<ComplaintResponse>> searchComplaint(@RequestParam("problem") String problem) {
        return ResponseEntity.ok(complaintReplyService.searchComplaintByProblem(problem).getBody());
    }
}
