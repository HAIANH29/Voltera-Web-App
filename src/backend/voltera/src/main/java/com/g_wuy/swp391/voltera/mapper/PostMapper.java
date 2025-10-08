package com.g_wuy.swp391.voltera.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.g_wuy.swp391.voltera.entity.Battery;
import com.g_wuy.swp391.voltera.entity.Post;
import com.g_wuy.swp391.voltera.entity.Vehicle;
import com.g_wuy.swp391.voltera.model.dto.BatteryDto;
import com.g_wuy.swp391.voltera.model.dto.VehicleDto;
import com.g_wuy.swp391.voltera.model.request.RejectRequest;
import com.g_wuy.swp391.voltera.model.response.PostResponse;
import com.g_wuy.swp391.voltera.model.response.RejectResponse;

import java.util.List;
import java.util.Optional;

@Mapper(componentModel = "spring")
public interface PostMapper {
    // Battery mapping
    @Mapping(source = "batteryTypeId", target = "batteryTypeId")
    BatteryDto toDTO(Battery battery);

    // Vehicle mapping
    VehicleDto toDTO(Vehicle vehicle);

    // PostResponse mapping
    @Mapping(source = "post.id", target = "postId")
    @Mapping(source = "post.title", target = "title")
    @Mapping(source = "post.description", target = "description")
    @Mapping(source = "post.price", target = "price")
    @Mapping(source = "post.status", target = "status")

    PostResponse toPostResponse(Post post, Battery battery, Vehicle vehicle, List<String> imageUrls);

    PostResponse toPostResponse(Optional<Post> post);

    @Mapping(source = "post.id", target = "postId")
    @Mapping(source = "post.title", target = "title")
    @Mapping(source = "post.status", target = "status")
    @Mapping(target = "rejectBy", source = "username")
    @Mapping(target = "rejectAt", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "reason", source = "reason")
    RejectResponse toRejectResponse(Post post, String username, String reason);
}
