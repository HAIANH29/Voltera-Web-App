package com.g_wuy.swp391.voltera.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "contract")
public class Contract {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "contractid", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "postid")
    private Post postid;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sellerid")
    @JsonIgnoreProperties({"contractsBought", "contractsSold"})
    private User sellerid;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "buyerid")
    @JsonIgnoreProperties({"contractsBought", "contractsSold"})
    private User buyerid;

    @Column(name = "contractfile", length = Integer.MAX_VALUE)
    private String contractfile;

    @Size(max = 20)
    @ColumnDefault("'PENDING'")
    @Column(name = "contractstatus", length = 20)
    private String contractstatus;

    @Column(name = "signeddate")
    private LocalDate signeddate;

    @Column(name = "expirationdate")
    private LocalDate expirationdate;

    @Column(name = "sellersigned")
    private Boolean sellersigned;

    @Column(name = "buyersigned")
    private Boolean buyersigned;

    @Column(name = "terms", length = Integer.MAX_VALUE)
    private String terms;
    @OneToMany(mappedBy = "contractid", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Transaction> transactions;
}