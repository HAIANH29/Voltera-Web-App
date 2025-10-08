package com.g_wuy.swp391.voltera.model.response;

import java.math.BigDecimal;
import java.util.List;

import com.g_wuy.swp391.voltera.model.dto.BatteryDto;
import com.g_wuy.swp391.voltera.model.dto.VehicleDto;

import lombok.Data;

@Data
public class PostResponse {
    private Integer postId;
    private String title;
    private String description;
    private BigDecimal price;
    private String status;
    private BatteryDto battery;
    private VehicleDto vehicle;
    private List<String> imageUrls;
}
