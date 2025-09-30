package com.g_wuy.swp391.voltera.mapper;

import com.g_wuy.swp391.voltera.entity.Battery;
import com.g_wuy.swp391.voltera.entity.Post;
import com.g_wuy.swp391.voltera.entity.Vehicle;
import com.g_wuy.swp391.voltera.model.dto.BatteryDTO;
import com.g_wuy.swp391.voltera.model.dto.VehicleDTO;
import com.g_wuy.swp391.voltera.model.dto.response.PostResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PostMapper {
    // Battery mapping
    @Mapping(source = "batterytypeid.id", target = "batteryTypeId")
    BatteryDTO toDTO(Battery battery);

    // Vehicle mapping
    VehicleDTO toDTO(Vehicle vehicle);

    // PostResponse mapping
    @Mapping(source = "id", target = "postId")
    @Mapping(source = "battery", target = "battery")
    @Mapping(source = "vehicle", target = "vehicle")
    @Mapping(source = "imageUrls", target = "imageUrls")
    PostResponse toPostResponse(Post post, Battery battery, Vehicle vehicle, List<String> imageUrls);
}
