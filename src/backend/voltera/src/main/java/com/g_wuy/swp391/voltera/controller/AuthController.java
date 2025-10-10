package com.g_wuy.swp391.voltera.controller;


import com.g_wuy.swp391.voltera.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;


import org.springframework.web.bind.annotation.*;

import com.g_wuy.swp391.voltera.model.request.LoginRequest;
import com.g_wuy.swp391.voltera.model.request.RegisterRequest;
import com.g_wuy.swp391.voltera.model.response.LoginResponse;
import com.g_wuy.swp391.voltera.model.response.RegisterResponse;
import com.g_wuy.swp391.voltera.service.AccountService;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private AccountService accountService;
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest request){
        RegisterResponse registerResponse = accountService.register(request);
        return ResponseEntity.ok(registerResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(userService.login(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refresh(@RequestParam String refreshToken) {
        return ResponseEntity.ok(userService.refresh(refreshToken));
    }
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestParam String username) {
        userService.logout(username);
        return ResponseEntity.ok("Logout successful");
    }

}
