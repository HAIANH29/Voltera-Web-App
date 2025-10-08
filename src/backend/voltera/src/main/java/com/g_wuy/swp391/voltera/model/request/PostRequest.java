package com.g_wuy.swp391.voltera.model.request;

import java.math.BigDecimal;

import com.g_wuy.swp391.voltera.model.dto.BatteryDto;
import com.g_wuy.swp391.voltera.model.dto.VehicleDto;

import lombok.Data;

@Data
public class PostRequest {
    private String title;
    private String description;
    private BigDecimal price;
    private String status;
    private BatteryDto battery;
    private VehicleDto vehicle;
//    private List<MultipartFile> images;
//    private List<MultipartFile> vehicleImages;
}
