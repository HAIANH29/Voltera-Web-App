package com.g_wuy.swp391.voltera.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;

@Entity
@Table(name = "vehicle")
public class Vehicle {
    @Id
    @Column(name = "postid", nullable = false)
    private Integer id;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "postid", nullable = false)
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "batterytypeid")
    private Batterytype batteryTypeId;

    @Size(max = 100)
    @Column(name = "brand", length = 100)
    private String brand;

    @Size(max = 100)
    @Column(name = "model", length = 100)
    private String model;

    @Size(max = 50)
    @Column(name = "version", length = 50)
    private String version;

    @Size(max = 50)
    @Column(name = "status", length = 50)
    private String status;

    @Column(name = "odo")
    private Integer odo;

    @Column(name = "batterycapacity", precision = 10, scale = 2)
    private BigDecimal batteryCapacity;

    @Column(name = "range")
    private Integer range;

    @Column(name = "chargingtime")
    private Integer chargingTime;

    @Size(max = 50)
    @Column(name = "color", length = 50)
    private String color;

    @Column(name = "numberofseat")
    private Integer numberOfSeat;

    @Size(max = 50)
    @Column(name = "style", length = 50)
    private String style;

    // Empty constructor
    public Vehicle() {
    }

    // Full constructor without id
    public Vehicle(Post post, Batterytype batteryTypeId, String brand, String model, String version, String status, Integer odo, BigDecimal batteryCapacity, Integer range, Integer chargingTime, String color, Integer numberOfSeat, String style) {
        this.post = post;
        this.batteryTypeId = batteryTypeId;
        this.brand = brand;
        this.model = model;
        this.version = version;
        this.status = status;
        this.odo = odo;
        this.batteryCapacity = batteryCapacity;
        this.range = range;
        this.chargingTime = chargingTime;
        this.color = color;
        this.numberOfSeat = numberOfSeat;
        this.style = style;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Post getPost() {
        return post;
    }

    public void setPost(Post post) {
        this.post = post;
    }

    public Batterytype getBatteryTypeId() {
        return batteryTypeId;
    }

    public void setBatteryTypeId(Batterytype batteryTypeId) {
        this.batteryTypeId = batteryTypeId;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getOdo() {
        return odo;
    }

    public void setOdo(Integer odo) {
        this.odo = odo;
    }

    public BigDecimal getBatteryCapacity() {
        return batteryCapacity;
    }

    public void setBatteryCapacity(BigDecimal batteryCapacity) {
        this.batteryCapacity = batteryCapacity;
    }

    public Integer getRange() {
        return range;
    }

    public void setRange(Integer range) {
        this.range = range;
    }

    public Integer getChargingTime() {
        return chargingTime;
    }

    public void setChargingTime(Integer chargingTime) {
        this.chargingTime = chargingTime;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Integer getNumberOfSeat() {
        return numberOfSeat;
    }

    public void setNumberOfSeat(Integer numberOfSeat) {
        this.numberOfSeat = numberOfSeat;
    }

    public String getStyle() {
        return style;
    }

    public void setStyle(String style) {
        this.style = style;
    }
}