package com.g_wuy.swp391.voltera.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Builder
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
    private Post post; // thay vì postId

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sellerid")
    private User seller; // thay vì sellerId

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyerid")
    private User buyer; // thay vì buyerId

    @Column(name = "contractfile", length = Integer.MAX_VALUE)
    private String contractfile;

    @Column(name = "signeddate")
    private LocalDate signeddate;

    @Column(name = "expirationdate")
    private LocalDate expirationdate;

    @Enumerated(EnumType.STRING)
    @ColumnDefault("'Pending'")
    @Column(name = "contractstatus")
    private ContractStatus contractstatus = ContractStatus.PENDING;

    public enum ContractStatus {
        PENDING, SIGNED, ACTIVE, EXPIRED, CANCELLED
    }
}
