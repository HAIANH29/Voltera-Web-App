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

@Getter
@Setter
@Entity
@Table(name = "externalaccount")
public class ExternalAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "externalid", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "userid")
    private User userid;

    @Size(max = 50)
    @NotNull
    @Column(name = "provider", nullable = false, length = 50)
    private String provider;

    @Size(max = 200)
    @NotNull
    @Column(name = "provideruserid", nullable = false, length = 200)
    private String providerUserId;

    @Size(max = 150)
    @Column(name = "email", length = 150)
    private String email;

    @Column(name = "accesstoken", length = Integer.MAX_VALUE)
    private String accessToken;

    @Column(name = "refreshtoken", length = Integer.MAX_VALUE)
    private String refreshToken;

    @Column(name = "expiresat")
    private Instant expiresAt;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "createdat")
    private Instant createdAt;

}