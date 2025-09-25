package com.g_wuy.swp391.voltera.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "transaction")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transactionid", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "postid")
    private Post postid;

    @Column(name = "reportid")
    private Integer reportid;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "createat")
    private Instant createat;

    @Column(name = "updateat")
    private Instant updateat;

    @Size(max = 50)
    @Column(name = "transactionstatus", length = 50)
    private String transactionstatus;

    @Column(name = "price", precision = 12, scale = 2)
    private BigDecimal price;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contractid")
    private Contract contractid;

}