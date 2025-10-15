package com.g_wuy.swp391.voltera.model.request;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class FilterRequest {
    private String keyword;
    private String address;
    private String brand;
    private String version;
    private Integer minOdo;
    private Integer maxOdo;
    private Integer minRange;
    private Integer maxRange;
    private String color;
    private String origin;
    private String style;
    private boolean bodyInsurance;
    private boolean vehicleInspection;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private int minYearManufacture;
    private int maxYearManufacture;
    private Integer numberOfSeat;
}