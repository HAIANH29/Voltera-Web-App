package com.g_wuy.swp391.voltera.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "bank")
public class Bank {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bankid", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "userid", nullable = false)
    private User userid;

    @Size(max = 150)
    @NotNull
    @Column(name = "bankname", nullable = false, length = 150)
    private String bankname;

    @Size(max = 50)
    @NotNull
    @Column(name = "accountnumber", nullable = false, length = 50)
    private String accountnumber;

    @Size(max = 200)
    @NotNull
    @Column(name = "accountname", nullable = false, length = 200)
    private String accountname;

    @Column(name = "securitycode")
    private Integer securitycode;

    @Column(name = "expdate")
    private LocalDate expdate;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "createdat")
    private Instant createdat;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "updatedat")
    private Instant updatedat;

}