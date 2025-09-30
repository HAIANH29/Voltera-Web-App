package com.g_wuy.swp391.voltera.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@AllArgsConstructor
@NoArgsConstructor
@Builder
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
    private Transaction transactionid;

    @Size(max = 50)
    @Column(name = "paymentmethod", length = 50)
    private String paymentmethod;

    @Size(max = 100)
    @Column(name = "transactioncode", length = 100)
    private String transactioncode;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "paymentdate")
    private Instant paymentdate;

    @Enumerated(EnumType.STRING)
    @ColumnDefault("'Pending'")
    @Column(name = "paymentstatus")
    private PaymentStatus paymentstatus = PaymentStatus.PENDING;

    public enum PaymentStatus {
        PENDING, PROCESSING, COMPLETED, FAILED, REFUNDED
    }

    @PrePersist
    protected void onCreate() {
        paymentdate = Instant.now();
    }

    public Payment(Transaction transactionid, String paymentmethod, String transactioncode, Instant paymentdate, PaymentStatus paymentstatus) {
        this.transactionid = transactionid;
        this.paymentmethod = paymentmethod;
        this.transactioncode = transactioncode;
        this.paymentdate = paymentdate;
        this.paymentstatus = paymentstatus;
    }
}