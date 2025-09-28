package com.g_wuy.swp391.voltera.mapper;

import com.g_wuy.swp391.voltera.entity.Battery;
import com.g_wuy.swp391.voltera.entity.Post;
import com.g_wuy.swp391.voltera.model.dto.BatteryDTO;
import com.g_wuy.swp391.voltera.model.dto.response.PostResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PostMapper {
    @Mapping(source = "batteryTypeId.id", target = "batteryTypeId") // ánh xạ nested property
    BatteryDTO toDTO(Battery battery);

    @Mapping(source = "post.id", target = "postId")
    @Mapping(source = "battery", target = "battery")
    @Mapping(source = "imageUrls", target = "imageUrls")
    PostResponse toPostResponse(Post post, Battery battery, List<String> imageUrls);
}

