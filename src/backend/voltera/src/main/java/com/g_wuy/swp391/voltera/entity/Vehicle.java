package com.g_wuy.swp391.voltera.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;

@Getter
@Setter
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
    private Batterytype batterytypeid;

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
    private BigDecimal batterycapacity;

    @Column(name = "range")
    private Integer range;

    @Column(name = "chargingtime")
    private Integer chargingtime;

    @Size(max = 50)
    @Column(name = "color", length = 50)
    private String color;

    @Column(name = "numberofseat")
    private Integer numberofseat;

    @Size(max = 50)
    @Column(name = "style", length = 50)
    private String style;

}