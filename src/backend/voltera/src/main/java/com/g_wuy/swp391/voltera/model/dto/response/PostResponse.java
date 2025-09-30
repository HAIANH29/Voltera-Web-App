package com.g_wuy.swp391.voltera.model.dto.response;

import com.g_wuy.swp391.voltera.model.dto.BatteryDTO;
import com.g_wuy.swp391.voltera.model.dto.VehicleDTO;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class PostResponse {
    private Integer postId;
    private String title;
    private String description;
    private BigDecimal price;
    private String status;
    private BatteryDTO battery;
    private VehicleDTO vehicle;
    private List<String> imageUrls;
}
