package com.g_wuy.swp391.voltera.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "report")
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reportid", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "senderid")
    private User senderId;

    @Column(name = "totalcost", precision = 12, scale = 2)
    private BigDecimal totalCost;

    @Column(name = "month")
    private Integer month;

    @Column(name = "year")
    private Integer year;

    // Empty constructor
    public Report() {
    }

    // Full constructor without id
    public Report(User senderId, BigDecimal totalCost, Integer month, Integer year) {
        this.senderId = senderId;
        this.totalCost = totalCost;
        this.month = month;
        this.year = year;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public User getSenderId() {
        return senderId;
    }

    public void setSenderId(User senderId) {
        this.senderId = senderId;
    }

    public BigDecimal getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(BigDecimal totalCost) {
        this.totalCost = totalCost;
    }

    public Integer getMonth() {
        return month;
    }

    public void setMonth(Integer month) {
        this.month = month;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }
}