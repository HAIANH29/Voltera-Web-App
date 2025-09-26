package com.g_wuy.swp391.voltera.mapper;

import com.g_wuy.swp391.voltera.entity.Account;
import com.g_wuy.swp391.voltera.model.dto.response.LoginResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AccountMapper {
    LoginResponse toLoginResponse(Account account);
}
