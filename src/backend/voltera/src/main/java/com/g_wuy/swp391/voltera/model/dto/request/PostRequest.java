package com.g_wuy.swp391.voltera.model.dto.request;

import com.g_wuy.swp391.voltera.model.dto.BatteryDTO;
import com.g_wuy.swp391.voltera.model.dto.VehicleDTO;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;


@Data
public class PostRequest {
    private String title;
    private String description;
    private BigDecimal price;
    private String status;
    private BatteryDTO battery;
    private VehicleDTO  vehicle;
    private List<MultipartFile> images;
    private List<MultipartFile> vehicleImages;
}
