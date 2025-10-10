package com.g_wuy.swp391.voltera.model.request;

import java.math.BigDecimal;

import com.g_wuy.swp391.voltera.model.dto.BatteryDTO;

import com.g_wuy.swp391.voltera.model.dto.VehicleDTO;


import lombok.Data;

@Data
public class PostRequest {
    private String title;
    private String description;
    private BigDecimal price;
    private String status;
    private BatteryDTO battery;
    private VehicleDTO vehicle;
//    private List<MultipartFile> images;
//    private List<MultipartFile> vehicleImages;
}
