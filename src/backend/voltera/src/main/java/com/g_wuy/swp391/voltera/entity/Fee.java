package com.g_wuy.swp391.voltera.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "fee")
public class Fee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "feeid", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "postid")
    private Post postId;

    @Column(name = "percentage", precision = 5, scale = 2)
    private BigDecimal percentage;

    @Column(name = "minprice", precision = 12, scale = 2)
    private BigDecimal minPrice;

    @Column(name = "maxprice", precision = 12, scale = 2)
    private BigDecimal maxPrice;

    // Empty constructor
    public Fee() {
    }

    // Full constructor without id
    public Fee(Post postId, BigDecimal percentage, BigDecimal minPrice, BigDecimal maxPrice) {
        this.postId = postId;
        this.percentage = percentage;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Post getPostId() {
        return postId;
    }

    public void setPostId(Post postId) {
        this.postId = postId;
    }

    public BigDecimal getPercentage() {
        return percentage;
    }

    public void setPercentage(BigDecimal percentage) {
        this.percentage = percentage;
    }

    public BigDecimal getMinPrice() {
        return minPrice;
    }

    public void setMinPrice(BigDecimal minPrice) {
        this.minPrice = minPrice;
    }

    public BigDecimal getMaxPrice() {
        return maxPrice;
    }

    public void setMaxPrice(BigDecimal maxPrice) {
        this.maxPrice = maxPrice;
    }
}