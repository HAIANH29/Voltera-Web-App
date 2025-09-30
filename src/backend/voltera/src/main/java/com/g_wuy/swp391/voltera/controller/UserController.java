package com.g_wuy.swp391.voltera.controller;

import com.g_wuy.swp391.voltera.entity.Account;
import com.g_wuy.swp391.voltera.entity.User;
import com.g_wuy.swp391.voltera.mapper.AccountMapper;
import com.g_wuy.swp391.voltera.mapper.UserMapper;
import com.g_wuy.swp391.voltera.model.response.ApproveResponse;
import com.g_wuy.swp391.voltera.model.response.ProfileResponse;
import com.g_wuy.swp391.voltera.service.AccountService;
import com.g_wuy.swp391.voltera.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        Account accountApprove = accountService.findAccountById(id);
        if (accountApprove != null) {
            accountService.approveAccount(accountApprove);
        }
        return ResponseEntity.ok(accountMapper.toAccountResponse(accountApprove));
    }

    @PostMapping("/api/users/{id}")
    public ResponseEntity<ProfileResponse> saveProfile(@PathVariable("id") Integer id, @RequestBody User user) {
        User userProfile = userService.saveProfile(id, user);
        if (userProfile == null) {
            throw new RuntimeException("User not found with id: " + id);
        }
        return ResponseEntity.ok(userMapper.toProfileResponse(userProfile));
    }
}
