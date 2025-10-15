package com.g_wuy.swp391.voltera.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.g_wuy.swp391.voltera.entity.FavoriteList;
import com.g_wuy.swp391.voltera.model.response.FavListResponse;

@Mapper(componentModel = "spring")
public interface FavListMapper {
    List<FavListResponse> toDtoList(List<FavoriteList> entities);
}