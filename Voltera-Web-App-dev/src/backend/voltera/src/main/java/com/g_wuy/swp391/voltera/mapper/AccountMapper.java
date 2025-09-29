package com.g_wuy.swp391.voltera.mapper;

import com.g_wuy.swp391.voltera.entity.Account;
import com.g_wuy.swp391.voltera.model.dto.request.RegisterRequest;
import com.g_wuy.swp391.voltera.model.dto.response.LoginResponse;
import com.g_wuy.swp391.voltera.model.dto.response.RegisterResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AccountMapper {
    LoginResponse toLoginResponse(Account account);
    Account toAccount(RegisterRequest request);
    RegisterResponse toRegisterResponse(Account account);
}