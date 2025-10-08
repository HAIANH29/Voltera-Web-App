package com.g_wuy.swp391.voltera.service;

import com.g_wuy.swp391.voltera.exception.DataNotMatches;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.g_wuy.swp391.voltera.entity.Account;
import com.g_wuy.swp391.voltera.entity.User;
import com.g_wuy.swp391.voltera.exception.AccountNotFound;
import com.g_wuy.swp391.voltera.exception.EmailAlreadyExistsException;
import com.g_wuy.swp391.voltera.mapper.AccountMapper;
import com.g_wuy.swp391.voltera.model.request.ProfileRequest;
import com.g_wuy.swp391.voltera.repository.AccountRepository;
import com.g_wuy.swp391.voltera.repository.UserRepository;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private AccountMapper accountMapper;


    public User saveUser(User user){
        return userRepository.save(user);
    }

    public Account findByUsername(String username) {
        Account account = accountRepository.findByUsername(username);
        if (account == null) {
            throw new AccountNotFound("Account not found with username: " + username);
        }
        return account;
    }

    public User saveProfile(Integer accountId, ProfileRequest profileRequest) {
        User user = userRepository.findUserById((accountId)).orElse(new User());

        Optional<Account> account = accountRepository.findById(accountId);
        if (account.isEmpty()) {
            throw new AccountNotFound("Account not found with id: " + accountId);
        }
        if (userRepository.isEmailExist(profileRequest.getEmail())) {
            throw new EmailAlreadyExistsException("Email " + profileRequest.getEmail() + " is exist");
        }
        if ("^(?:0)(?:3[0-9]|5[0-9]|7[0-9]|8[0-9]|9[0-9])\\d{7}$\n".matches(profileRequest.getPhone())) {
            throw new DataNotMatches("Phone number isn't belong to Viet Nam");
        }
        if ("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$\n".matches(profileRequest.getEmail())) {
            throw new DataNotMatches("This is not an email format");
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
}