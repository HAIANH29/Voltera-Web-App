package com.g_wuy.swp391.voltera.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.g_wuy.swp391.voltera.entity.Account;
import com.g_wuy.swp391.voltera.entity.User;
import com.g_wuy.swp391.voltera.exception.BusinessException;
import com.g_wuy.swp391.voltera.exception.LogicException;
import com.g_wuy.swp391.voltera.mapper.AccountMapper;
import com.g_wuy.swp391.voltera.model.request.LoginRequest;
import com.g_wuy.swp391.voltera.model.request.ProfileRequest;
import com.g_wuy.swp391.voltera.model.response.LoginResponse;
import com.g_wuy.swp391.voltera.repository.AccountRepository;
import com.g_wuy.swp391.voltera.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    @Autowired
    private final UserRepository userRepository;

    @Autowired
    private final AccountRepository accountRepository;

    private final AccountMapper accountMapper;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        Account account = accountRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BusinessException("Account not found with username: " + request.getUsername()));

        if (!"APPROVE".equalsIgnoreCase(account.getStatus())) {
            throw new RuntimeException("Your account has not been approved yet.");
        }

        String accessToken = jwtService.generateToken(account);
        String refreshToken = jwtService.generateRefreshToken(account);

        account.setRefreshToken(refreshToken);
        accountRepository.save(account);

        LoginResponse response = accountMapper.toLoginResponse(account);
        response.setToken(accessToken);
        return response;
    }

    public LoginResponse refresh(String refreshToken) {
        String username = jwtService.extractUsername(refreshToken);

        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException("Account not found with username: " + username));

        if (account.getRefreshToken() == null ||
                !account.getRefreshToken().equals(refreshToken) ||
                jwtService.isTokenExpired(refreshToken)) {
            throw new RuntimeException("Invalid or expired refresh token");
        }

        String newAccessToken = jwtService.generateToken(account);

        LoginResponse response = accountMapper.toLoginResponse(account);
        response.setToken(newAccessToken);
        return response;
    }

    public User saveProfile(Integer accountId, ProfileRequest profileRequest) {
        User user = userRepository.findUserById(accountId).orElse(new User());

        Optional<Account> account = accountRepository.findById(accountId);
        if (account.isEmpty()) {
            throw new BusinessException("Account not found with id: " + accountId);
        }
        if (userRepository.isEmailExist(profileRequest.getEmail())) {
            throw new BusinessException("Email " + profileRequest.getEmail() + " is exist");
        }

        if (!profileRequest.getPhone().matches("^(?:0)(?:3[0-9]|5[0-9]|7[0-9]|8[0-9]|9[0-9])\\d{7}$")) {
            throw new LogicException("Phone number isn't belong to Viet Nam");
        }
        if (!profileRequest.getEmail().matches("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")) {
            throw new LogicException("This is not an email format");
        }

        user.setId(accountId);
        user.setFirstname(profileRequest.getFirstname());
        user.setLastname(profileRequest.getLastname());
        user.setFullName(profileRequest.getFirstname() + " " + profileRequest.getLastname());
        user.setEmail(profileRequest.getEmail());
        user.setPhone(profileRequest.getPhone());
        user.setGender(profileRequest.getGender());
        user.setAddress(profileRequest.getAddress());

        return userRepository.save(user);
    }

    public User findUserByUsername(String username) {
        if (username == null || username.isEmpty()) {
            throw new BusinessException("Username not found");
        }
        return userRepository.findUserByUsername(username);
    }

    public void logout(String username) {
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException("Account not found with username: " + username));

        account.setRefreshToken(null);
        accountRepository.save(account);
    }
}