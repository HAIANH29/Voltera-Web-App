package com.g_wuy.swp391.voltera.mapper;

import org.mapstruct.*;

import com.g_wuy.swp391.voltera.entity.Battery;
import com.g_wuy.swp391.voltera.entity.Post;
import com.g_wuy.swp391.voltera.entity.Vehicle;
import com.g_wuy.swp391.voltera.model.response.PostResponse;
import com.g_wuy.swp391.voltera.model.response.RejectResponse;

import java.util.List;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)

public interface PostMapper {


    @Mapping(source = "post.id", target = "postId")
    @Mapping(source = "post.title", target = "title")
    @Mapping(source = "post.description", target = "description")
    @Mapping(source = "post.price", target = "price")
    @Mapping(source = "post.status", target = "status")
    PostResponse toPostResponse(Post post, Battery battery, Vehicle vehicle, List<String> imageUrls);
    @AfterMapping
    default void setThumbnail(@MappingTarget PostResponse response, List<String> imageUrls) {
        if (imageUrls != null && !imageUrls.isEmpty()) {
            response.setThumbnail(imageUrls.get(0));
        }
        response.setImageUrls(imageUrls);
    }
    @Mapping(source = "post.id", target = "postId")
    @Mapping(source = "post.title", target = "title")
    @Mapping(source = "post.status", target = "status")
    @Mapping(target = "rejectBy", source = "username")
    @Mapping(target = "rejectAt", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "reason", source = "reason")
    RejectResponse toRejectResponse(Post post, String username, String reason);
}
