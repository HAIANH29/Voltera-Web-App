package com.g_wuy.swp391.voltera.entity;

import jakarta.persistence.*;

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

    // Empty constructor
    public Review() {
    }

    // Full constructor without id
    public Review(User writerId, String content, Integer rating) {
        this.writerId = writerId;
        this.content = content;
        this.rating = rating;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public User getWriterId() {
        return writerId;
    }

    public void setWriterId(User writerId) {
        this.writerId = writerId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }
}