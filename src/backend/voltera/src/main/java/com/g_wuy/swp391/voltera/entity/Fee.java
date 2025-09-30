package com.g_wuy.swp391.voltera.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "fee")
public class Fee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "feeid", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "postid")
    private Post postid;

    @Column(name = "percentage", precision = 5, scale = 2)
    private BigDecimal percentage;

    @Column(name = "minprice", precision = 12, scale = 2)
    private BigDecimal minprice;

    @Column(name = "maxprice", precision = 12, scale = 2)
    private BigDecimal maxprice;
}
