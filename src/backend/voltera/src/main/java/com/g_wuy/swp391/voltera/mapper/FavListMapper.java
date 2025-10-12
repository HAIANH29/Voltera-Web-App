package com.g_wuy.swp391.voltera.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.g_wuy.swp391.voltera.entity.Favoritelist;
import com.g_wuy.swp391.voltera.model.response.FavListResponse;

@Mapper(componentModel = "spring")
public interface FavListMapper {
    @Mapping(source = "favoritelist.userid.id", target = "userId")
    @Mapping(source = "favoritelist.postid.id", target = "postId")
    @Mapping(source = "favoritelist.postid.title", target = "postTitle")
    @Mapping(source = "favoritelist.postid.price", target = "price")
    FavListResponse toFavListResponse(Favoritelist favoritelist);
    List<FavListResponse> toDtoList(List<Favoritelist> entities);
}