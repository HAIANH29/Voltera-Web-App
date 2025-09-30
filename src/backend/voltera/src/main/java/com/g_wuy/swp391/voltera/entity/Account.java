package com.g_wuy.swp391.voltera.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "account")
public class Account {
    @Id
    @Column(name = "userid", nullable = false)
    private Integer id;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "userid", nullable = false)
    private User user;

    @Size(max = 100)
    @NotNull
    @Column(name = "username", nullable = false, length = 100)
    private String username;

    @Size(max = 255)
    @NotNull
    @Column(name = "password", nullable = false)
    private String password;

    @Size(max = 50)
    @Column(name = "role", length = 50)
    private String role;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "createat")
    private Instant createat;
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "updateat")
    private Instant updateat;


    @Enumerated(EnumType.STRING)
    @ColumnDefault("'Pending'")
    @Column(name = "status")
    private AccountStatus status = AccountStatus.PENDING;

    public enum AccountStatus {
        PENDING, ACTIVE, INACTIVE, BANNED
    }

    @PrePersist
    protected void onCreate() {
        createat = Instant.now();
        updateat = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updateat = Instant.now();
    }
}