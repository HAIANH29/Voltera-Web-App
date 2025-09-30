package com.g_wuy.swp391.voltera.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "batterytype")
public class Batterytype {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 100)
    @NotNull
    @Column(name = "typename", nullable = false, length = 100)
    private String typename;

    @Size(max = 200)
    @Column(name = "technical", length = 200)
    private String technical;

    @Column(name = "description", length = Integer.MAX_VALUE)
    private String description;

}