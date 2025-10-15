package com.g_wuy.swp391.voltera.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.g_wuy.swp391.voltera.entity.Account;
import com.g_wuy.swp391.voltera.entity.User;
import com.g_wuy.swp391.voltera.mapper.AccountMapper;
import com.g_wuy.swp391.voltera.mapper.UserMapper;
import com.g_wuy.swp391.voltera.model.request.ProfileRequest;
import com.g_wuy.swp391.voltera.model.response.ApproveResponse;
import com.g_wuy.swp391.voltera.model.response.ProfileResponse;
import com.g_wuy.swp391.voltera.service.AccountService;
import com.g_wuy.swp391.voltera.service.UserService;

@RestController
public class UserController {

    @Autowired
    private AccountService accountService;

    @Autowired
    private UserService userService;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private AccountMapper accountMapper;

    @PutMapping("/api/admin/account/{id}/approved")
    public ResponseEntity<ApproveResponse> approve(@PathVariable Integer id) {
        Account accountApprove = accountService.approveAccount(id);
        return ResponseEntity.ok(accountMapper.toAccountResponse(accountApprove));
    }

    @PutMapping("/api/users/{id}")
    public ResponseEntity<ProfileResponse> saveProfile(
            @PathVariable("id") Integer userId,
            @RequestBody ProfileRequest request) {

        User userProfile = userService.saveProfile(userId, request);
        return ResponseEntity.ok(userMapper.toProfileResponse(userProfile));
    }

    @GetMapping("/me")
    public Map<String, Object> getCurrentUser(Authentication authentication) {
        Map<String, Object> response = new HashMap<>();
        response.put("username", authentication.getName());
        response.put("roles", authentication.getAuthorities());
        return response;
    }

}