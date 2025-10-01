package com.g_wuy.swp391.voltera.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@NoArgsConstructor
@AllArgsConstructor
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

    @Enumerated(EnumType.STRING)
    @ColumnDefault("'BUYER'")
    private Role role;

    public enum Role {
        ADMIN, 
        Seller, 
        BUYER
    }

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "createat")
    private Instant createat;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "updateat")
    private Instant updateat;

    @Enumerated(EnumType.STRING)
    @ColumnDefault("'PENDING'")
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
