package com.g_wuy.swp391.voltera.model.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class VehicleDTO {
    private String brand;
    private String model;
    private String version;
    private Integer odo;
    private BigDecimal batterycapacity;
    private Integer range;
    private Integer chargingtime;
    private String color;
    private Integer numberofseat;
    private String style;
    private Boolean bodyinsurance;
    private Boolean vehicleinspection;
    private String licenseplate;
    private String origin;
}
