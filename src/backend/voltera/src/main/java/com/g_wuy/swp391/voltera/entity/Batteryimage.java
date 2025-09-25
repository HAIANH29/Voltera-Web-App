package com.g_wuy.swp391.voltera.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "batteryimage")
public class Batteryimage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "imageid", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "postid")
    private Battery postid;

    @NotNull
    @Column(name = "imageurl", nullable = false, length = Integer.MAX_VALUE)
    private String imageurl;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "uploadedat")
    private Instant uploadedat;

}