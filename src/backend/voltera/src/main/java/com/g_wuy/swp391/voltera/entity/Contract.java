package com.g_wuy.swp391.voltera.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "contract")
public class Contract {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "contractid", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "postid")
    private Post postid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sellerid")
    private User sellerid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyerid")
    private User buyerid;

    @Column(name = "contractfile", length = Integer.MAX_VALUE)
    private String contractfile;

    @Column(name = "signeddate")
    private LocalDate signeddate;
    @Column(name = "expirationdate")
    private LocalDate expirationdate;

/*
 TODO [Reverse Engineering] create field to map the 'contractstatus' column
 Available actions: Define target Java type | Uncomment as is | Remove column mapping
    @ColumnDefault("'Pending'")
    @Column(name = "contractstatus", columnDefinition = "contract_status")
    private Object contractstatus;
*/
}