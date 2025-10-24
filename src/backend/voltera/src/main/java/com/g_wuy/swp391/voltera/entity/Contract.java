package com.g_wuy.swp391.voltera.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "contract")
public class Contract {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "contractid", nullable = false)
    private Integer contractId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "postid")
    private Post postId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sellerid")
    private User sellerId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyerid")
    private User buyerId;

    @Column(name = "contractfile", length = Integer.MAX_VALUE)
    private String contractFile;

    @Size(max = 20)
    @ColumnDefault("'PENDING'")
    @Column(name = "contractstatus", length = 20)
    private String contractStatus;

    @Column(name = "signeddate")
    private LocalDate signedDate;

    @Column(name = "expirationdate")
    private LocalDate expirationDate;

    @Column(name = "sellersigned")
    private Boolean sellersigned;

    @Column(name = "buyersigned")
    private Boolean buyersigned;

    @Column(name = "terms", length = Integer.MAX_VALUE)
    private String terms;

    @OneToOne(mappedBy = "contract", cascade = CascadeType.ALL, fetch = FetchType.LAZY, optional = true)
    private Report report;
}