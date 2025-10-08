package com.g_wuy.swp391.voltera.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
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

}