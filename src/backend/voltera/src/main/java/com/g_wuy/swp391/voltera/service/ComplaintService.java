package com.g_wuy.swp391.voltera.service;

import com.g_wuy.swp391.voltera.entity.Account;
import com.g_wuy.swp391.voltera.entity.Complaint;
import com.g_wuy.swp391.voltera.entity.User;
import com.g_wuy.swp391.voltera.exception.BusinessException;
import com.g_wuy.swp391.voltera.mapper.ComplaintMapper;
import com.g_wuy.swp391.voltera.model.request.ComplaintRequest;
import com.g_wuy.swp391.voltera.model.response.ComplaintResponse;
import com.g_wuy.swp391.voltera.repository.AccountRepository;
import com.g_wuy.swp391.voltera.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestHeader;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private UserService userService;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private ComplaintMapper complaintMapper;
    @Autowired
    private AccountRepository accountRepository;

    public Complaint createComplaint(ComplaintRequest request, @RequestHeader("Authorization") String auth) {
        String token = auth.substring(7);
        if (token == null) {
            throw new BusinessException("Can't get token");
        }
        User sender = userService.findUserByUsername(jwtService.extractUsername(token));
        if (sender == null) {
            throw new BusinessException("User not found");
        }
        Complaint complaint = complaintMapper.toComplaint(request);
        complaint.setSenderId(sender);
        complaint.setStatus("PENDING");
        complaint.setCreateAt(LocalDateTime.now());
        complaintRepository.save(complaint);
        return complaint;
    }

    public List<Complaint> getComplaintByStatus(String status, @RequestHeader("Authorization") String auth) {
        String token = auth.substring(7);
        Optional<Account> account = accountRepository.findByUsername(jwtService.extractUsername(token));
        if (!account.get().getRole().equals("ADMIN")) {
            throw new BusinessException("You don't have permission to do this action");
        }
        return complaintRepository.getComplaintsByStatusIgnoreCase(status);
    }

    public List<Complaint> viewComplaintByUserId(@RequestHeader("Authorization") String auth) {
        String token = auth.substring(7);
        User sender = userService.findUserByUsername(jwtService.extractUsername(token));
        if (sender == null) {
            throw new BusinessException("User not found");
        }
        return complaintRepository.viewComplaintByUserId(sender.getId());
    }

    public Optional<Complaint> detailComplaint(Integer complaintId) {
        Optional<Complaint> complaint = complaintRepository.findById(complaintId);
        return complaint;
    }

    public ResponseEntity<Complaint> updateComplaintStatusById(Integer complaintId, String status) {
        Complaint complaint = complaintRepository.findComplaintById(complaintId);
        if (complaint != null) {
            complaint.setStatus(status);
            complaintRepository.save(complaint);
        }

        return ResponseEntity.ok(complaint);
    }
}