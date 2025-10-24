package com.g_wuy.swp391.voltera.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "transaction")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transactionid", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "postid")
    private Post postid;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "createat")
    private Instant createat;

    @Column(name = "updateat")
    private Instant updateat;

    @Column(name = "price", precision = 12, scale = 2)
    private BigDecimal price;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "contractid")
    private Contract contractid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reportid")
    private Report reportid;

    @Size(max = 20)
    @ColumnDefault("'PENDING'")
    @Column(name = "transactionstatus", length = 20)
    private String transactionstatus;

}