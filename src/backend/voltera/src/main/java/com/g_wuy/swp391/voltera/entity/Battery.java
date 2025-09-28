package com.g_wuy.swp391.voltera.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;

@Entity
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
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

    @Column(name = "origincapacity", precision = 10, scale = 2)
    private BigDecimal originCapacity;

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


}