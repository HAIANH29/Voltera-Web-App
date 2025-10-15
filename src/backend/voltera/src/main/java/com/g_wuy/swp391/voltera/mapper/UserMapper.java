package com.g_wuy.swp391.voltera.mapper;

import org.mapstruct.Mapper;

import com.g_wuy.swp391.voltera.entity.Account;
import com.g_wuy.swp391.voltera.entity.User;

import com.g_wuy.swp391.voltera.model.response.ProfileResponse;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(Account account);
    ProfileResponse toProfileResponse(User user);
}