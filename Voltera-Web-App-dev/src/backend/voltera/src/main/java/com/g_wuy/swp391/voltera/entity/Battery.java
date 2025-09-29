package com.g_wuy.swp391.voltera.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;

@Entity
@Table(name = "battery")
public class Battery {
    @Id
    @Column(name = "postid", nullable = false)
    private Integer postId;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "postid", nullable = false)
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "batterytypeid")
    private Batterytype batteryTypeId;

    @Size(max = 100)
    @NotNull
    @Column(name = "serialnumber", nullable = false, length = 100)
    private String serialNumber;

    @Column(name = "rigincapacity", precision = 10, scale = 2)
    private BigDecimal riginCapacity;

    @Column(name = "remainingcapacity", precision = 10, scale = 2)
    private BigDecimal remainingCapacity;

    @Column(name = "mileagecovered")
    private Integer mileageCovered;

    @Column(name = "voltage", precision = 10, scale = 2)
    private BigDecimal voltage;

    @Column(name = "cyclecount")
    private Integer cycleCount;

    @Size(max = 100)
    @Column(name = "warranty", length = 100)
    private String warranty;

    @Column(name = "weight", precision = 10, scale = 2)
    private BigDecimal weight;

    @Size(max = 100)
    @Column(name = "lifecycle", length = 100)
    private String lifeCycle;

    public Battery() {
    }

    public Battery(Post post, Batterytype batteryTypeId, String serialNumber, BigDecimal riginCapacity, BigDecimal remainingCapacity, Integer mileageCovered, BigDecimal voltage, Integer cycleCount, String warranty, BigDecimal weight, String lifeCycle) {
        this.post = post;
        this.batteryTypeId = batteryTypeId;
        this.serialNumber = serialNumber;
        this.riginCapacity = riginCapacity;
        this.remainingCapacity = remainingCapacity;
        this.mileageCovered = mileageCovered;
        this.voltage = voltage;
        this.cycleCount = cycleCount;
        this.warranty = warranty;
        this.weight = weight;
        this.lifeCycle = lifeCycle;
    }

    public Integer getPostId() {
        return postId;
    }

    public void setPostId(Integer postId) {
        this.postId = postId;
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

    public String getSerialNumber() {
        return serialNumber;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public BigDecimal getRiginCapacity() {
        return riginCapacity;
    }

    public void setRiginCapacity(BigDecimal riginCapacity) {
        this.riginCapacity = riginCapacity;
    }

    public BigDecimal getRemainingCapacity() {
        return remainingCapacity;
    }

    public void setRemainingCapacity(BigDecimal remainingCapacity) {
        this.remainingCapacity = remainingCapacity;
    }

    public Integer getMileageCovered() {
        return mileageCovered;
    }

    public void setMileageCovered(Integer mileageCovered) {
        this.mileageCovered = mileageCovered;
    }

    public BigDecimal getVoltage() {
        return voltage;
    }

    public void setVoltage(BigDecimal voltage) {
        this.voltage = voltage;
    }

    public Integer getCycleCount() {
        return cycleCount;
    }

    public void setCycleCount(Integer cycleCount) {
        this.cycleCount = cycleCount;
    }

    public String getWarranty() {
        return warranty;
    }

    public void setWarranty(String warranty) {
        this.warranty = warranty;
    }

    public BigDecimal getWeight() {
        return weight;
    }

    public void setWeight(BigDecimal weight) {
        this.weight = weight;
    }

    public String getLifeCycle() {
        return lifeCycle;
    }

    public void setLifeCycle(String lifeCycle) {
        this.lifeCycle = lifeCycle;
    }
}