package com.g_wuy.swp391.voltera.mapper;

import com.g_wuy.swp391.voltera.entity.Account;
import com.g_wuy.swp391.voltera.entity.User;
import com.g_wuy.swp391.voltera.model.response.LoginResponse;
import com.g_wuy.swp391.voltera.model.response.ProfileResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    User toUser(Account account);
    @Mapping(source = "username", target = "username")
    @Mapping(source = "role", target = "role")
    @Mapping(target = "token", ignore = true)
    LoginResponse toLoginResponse(Account account);

    ProfileResponse toProfileResponse(User user);
}
