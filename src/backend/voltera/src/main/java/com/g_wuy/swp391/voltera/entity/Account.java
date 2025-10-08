package com.g_wuy.swp391.voltera.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
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
    @Column(name = "username", nullable = false, length = 100)
    private String username;

    @Size(max = 255)
    @Column(name = "password", nullable = false)
    private String password;

    @Size(max = 20)
    @Column(name = "role", length = 20)
    private String role;

    @Size(max = 20)
    @Column(name = "status", length = 20)
    private String status;

    @Column(name = "createat")
    private Instant createAt;

    @Column(name = "updateat")
    private Instant updateAt;

    @Column(name = "accesstoken")
    private String accessToken;

    @Column(name = "refreshtoken")
    private String refreshToken;

    @PrePersist
    protected void onCreate() {
        createAt = Instant.now();
        updateAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updateAt = Instant.now();
    }
}