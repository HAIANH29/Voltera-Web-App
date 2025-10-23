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
    @Column(name = "transactionid")
    private Integer transactionId;

    @Column(name = "postid")
    private Integer postId;

    @Column(name = "reportid")
    private Integer reportId;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "createat")
    private Instant createAt;

    @Column(name = "updateat")
    private Instant updateAt;

    @Size(max = 20)
    @ColumnDefault("'PENDING'")
    @Column(name = "transactionstatus", length = 20)
    private String transactionStatus; // PENDING, PROCESSING, COMPLETED, FAILED, CANCELLED

    @Column(name = "price", precision = 12, scale = 2)
    private BigDecimal price;

    @Column(name = "contractid")
    private Integer contractId;
}