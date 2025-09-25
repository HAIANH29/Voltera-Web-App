package com.g_wuy.swp391.voltera.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

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
    private String typeName;

    @Size(max = 200)
    @Column(name = "technical", length = 200)
    private String technical;

    @Column(name = "description", length = Integer.MAX_VALUE)
    private String description;

    // Empty constructor
    public Batterytype() {
    }

    // Full constructor without id
    public Batterytype(String typeName, String technical, String description) {
        this.typeName = typeName;
        this.technical = technical;
        this.description = description;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTypeName() {
        return typeName;
    }

    public void setTypeName(String typeName) {
        this.typeName = typeName;
    }

    public String getTechnical() {
        return technical;
    }

    public void setTechnical(String technical) {
        this.technical = technical;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}