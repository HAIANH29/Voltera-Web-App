package com.g_wuy.swp391.voltera.mapper;

import com.g_wuy.swp391.voltera.entity.Account;
import com.g_wuy.swp391.voltera.model.response.LoginResponse;
import com.g_wuy.swp391.voltera.model.request.RegisterRequest;
import com.g_wuy.swp391.voltera.model.response.ApproveResponse;
import com.g_wuy.swp391.voltera.model.response.RegisterResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AccountMapper {
    LoginResponse toLoginResponse(Account account);
    Account toAccount(RegisterRequest request);
    RegisterResponse toRegisterResponse(Account account);
    ApproveResponse toAccountResponse(Account account);
}
