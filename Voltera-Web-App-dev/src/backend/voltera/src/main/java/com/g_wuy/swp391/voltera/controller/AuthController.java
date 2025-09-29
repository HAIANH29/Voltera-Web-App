package com.g_wuy.swp391.voltera.controller;

import com.g_wuy.swp391.voltera.entity.Account;
import com.g_wuy.swp391.voltera.entity.User;
import com.g_wuy.swp391.voltera.mapper.AccountMapper;
import com.g_wuy.swp391.voltera.model.dto.request.LoginRequest;
import com.g_wuy.swp391.voltera.model.dto.request.RegisterRequest;
import com.g_wuy.swp391.voltera.model.dto.response.LoginResponse;
import com.g_wuy.swp391.voltera.model.dto.response.RegisterResponse;
import com.g_wuy.swp391.voltera.service.JwtService;
import com.g_wuy.swp391.voltera.service.UserService;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/auth")
@RequiredArgsConstructor
public class AuthController {
    @Autowired
    private final UserService userService;
    @Autowired
    private final JwtService  jwtService;
    @Autowired
    private final AuthenticationManager authManager;
    @Autowired
    private final AccountMapper  accountMapper;
    @Autowired
    private final UserDetailsService userDetailsService;


    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
            authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
        Account account = userService.findByUsername(request.getUsername());

        // Chuyển đổi Account thành UserDetails
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        String token = jwtService.generateToken(userDetails);

        // Ánh xạ từ Account sang LoginResponse sử dụng Mapper
        LoginResponse response = accountMapper.toLoginResponse(account);
        response.setToken(token);
        response.setRole(jwtService.extractRole(token));

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest request) {
        Account result = userService.registerAccount(accountMapper.toAccount(request));
        return ResponseEntity.ok(accountMapper.toRegisterResponse(result));
    }
}
