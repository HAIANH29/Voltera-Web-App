package com.g_wuy.swp391.voltera.service;

import com.g_wuy.swp391.voltera.entity.Account;
import com.g_wuy.swp391.voltera.entity.User;
import com.g_wuy.swp391.voltera.mapper.UserMapper;
import com.g_wuy.swp391.voltera.repository.AccountRepository;
import com.g_wuy.swp391.voltera.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    @Autowired
    private  AccountRepository accountRepository;

    @Autowired
    private  UserMapper userMapper;
    @Autowired
    private UserRepository userRepository;

    public Account findByUsername(String username) {
        Account account = accountRepository.findByUsername(username);
        if (account == null) {
            throw new RuntimeException("Account not found with username: " + username);
        }
        return account;
    }

    public void saveUser(User user) {
        userRepository.save(user);
    }

    public User saveProfile(Integer accountId, User userProfile) {
        User user = userRepository.findUserById(accountId)
                .orElse(new User());

        Optional<Account> account = accountRepository.findById(accountId);
        if (account.isEmpty()) {
            throw new RuntimeException("Account not found with id: " + accountId);
        }
        user.setId(accountId);
        user.setFirstName(userProfile.getFirstName());
        user.setLastName(userProfile.getLastName());
        user.setFullName(userProfile.getFirstName() + " " + userProfile.getLastName());
        user.setEmail(userProfile.getEmail());
        user.setPhone(userProfile.getPhone());
        user.setGender(userProfile.getGender());
        user.setAddress(userProfile.getAddress());

        return userRepository.save(user);
    }

}
