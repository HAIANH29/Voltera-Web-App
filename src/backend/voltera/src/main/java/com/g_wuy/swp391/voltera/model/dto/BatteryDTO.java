package com.g_wuy.swp391.voltera.model.dto;

import java.math.BigDecimal;

import com.g_wuy.swp391.voltera.entity.Batterytype;

import lombok.Data;

@Data
public class BatteryDTO {
    private String serialNumber;
    private BigDecimal originCapacity;
    private BigDecimal remainingCapacity;
    private Integer mileageCovered;
    private BigDecimal voltage;
    private Integer cycleCount;
    private String warranty;
    private BigDecimal weight;
    private String lifeCycle;
    private Batterytype batteryTypeId;
}
