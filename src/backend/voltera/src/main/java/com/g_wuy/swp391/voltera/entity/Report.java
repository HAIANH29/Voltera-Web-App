package com.g_wuy.swp391.voltera.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@AllArgsConstructor
@NoArgsConstructor
@Builder
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
    private User senderid;

    @Column(name = "totalcost", precision = 12, scale = 2)
    private BigDecimal totalcost;

    @Column(name = "month")
    private Integer month;

    @Column(name = "year")
    private Integer year;
}
