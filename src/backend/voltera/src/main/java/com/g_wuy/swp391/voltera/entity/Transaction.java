package com.g_wuy.swp391.voltera.entity;

import jakarta.persistence.*;
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

    @Column(name = "price", precision = 12, scale = 2)
    private BigDecimal price;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contractid")
    private Contract contractid;

/*
 TODO [Reverse Engineering] create field to map the 'transactionstatus' column
 Available actions: Define target Java type | Uncomment as is | Remove column mapping
    @Column(name = "transactionstatus", columnDefinition = "transaction_status")
    private Object transactionstatus;
*/
}