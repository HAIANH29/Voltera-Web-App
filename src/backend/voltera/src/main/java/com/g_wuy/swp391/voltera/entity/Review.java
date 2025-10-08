package com.g_wuy.swp391.voltera.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "review")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reviewid", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "writerid")
    private User writerId;

    @Column(name = "content", length = Integer.MAX_VALUE)
    private String content;

    @Column(name = "rating")
    private Integer rating;

}