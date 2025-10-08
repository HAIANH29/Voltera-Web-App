package com.g_wuy.swp391.voltera.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.OffsetDateTime;

@Getter
@Setter
@Entity
@Table(name = "description")
public class Description {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "complaintid", nullable = false)
    private Integer id;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "createat")
    private OffsetDateTime createAt;

    @Column(name = "description", length = Integer.MAX_VALUE)
    private String description;

    @Size(max = 200)
    @Column(name = "problem", length = 200)
    private String problem;

    @Column(name = "resolveat")
    private OffsetDateTime resolveAt;

    @Size(max = 50)
    @Column(name = "status", length = 50)
    private String status;

    @Column(name = "senderid")
    private Integer senderId;

}