package com.g_wuy.swp391.voltera.model.dto;

import java.math.BigDecimal;

import lombok.Data;
@Data
public class VehicleDTO {
    private String brand;
    private String model;
    private String version;
    private Integer odo;
    private BigDecimal batteryCapacity;
    private Integer range;
    private Integer chargingTime;
    private String color;
    private Integer numberOfSeat;
    private String style;
    private Boolean bodyInsurance;
    private Boolean vehicleInspection;
    private String licensePlate;
    private String origin;
    private int yearManufacture;
}
