package com.g_wuy.swp391.voltera.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
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

    @Size(max = 50)
    @Column(name = "contractstatus", length = 50)
    private String contractstatus;

    @Column(name = "signeddate")
    private LocalDate signeddate;

    @Column(name = "expirationdate")
    private LocalDate expirationdate;

}