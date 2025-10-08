package com.g_wuy.swp391.voltera.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "payment")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "paymentid", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transactionid")
    private Transaction transactionId;

    @Size(max = 50)
    @Column(name = "paymentmethod", length = 50)
    private String paymentMethod;

    @Size(max = 20)
    @Column(name = "paymentstatus", length = 20)
    private String paymentStatus;

    @Size(max = 100)
    @Column(name = "transactioncode", length = 100)
    private String transactionCode;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "paymentdate")
    private Instant paymentDate;

}