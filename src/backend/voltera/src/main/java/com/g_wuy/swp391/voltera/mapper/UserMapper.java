package com.g_wuy.swp391.voltera.mapper;

import com.g_wuy.swp391.voltera.entity.Account;
import com.g_wuy.swp391.voltera.model.dto.response.LoginResponse;
import org.apache.catalina.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    Account toAccount(User user);
    User toUser(Account account);
    @Mapping(source = "username", target = "username")
    @Mapping(source = "role", target = "role")
    @Mapping(target = "token", ignore = true)
    LoginResponse toLoginResponse(Account account);
}
