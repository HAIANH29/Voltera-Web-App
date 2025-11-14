package com.g_wuy.swp391.voltera.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "post")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "postid", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sellerid")
    @JsonIgnore
    private User sellerId;

    @Size(max = 200)
    @Column(name = "title", length = 200)
    private String title;

    @Column(name = "description", length = Integer.MAX_VALUE)
    private String description;

    @Column(name = "price", precision = 12, scale = 2)
    private BigDecimal price;

    @Size(max = 20)
    @ColumnDefault("'PENDING'")
    @Column(name = "status", length = 20)
    private String status;

    @Size(max = 20)
    @ColumnDefault("'PENDING'")
    @Column(name = "feestatus", length = 20)
    private String feeStatus;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "createdat")
    private Instant createdAt;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "updatedat")
    private Instant updatedAt;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Transaction> transactions;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Fee> fees;

    @OneToOne(mappedBy = "post", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Vehicle vehicle;
    @OneToOne(mappedBy = "post", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Battery battery;

    // Helper method to get current fee status from fees
    public String getCurrentFeeStatus() {
        if (fees != null && !fees.isEmpty()) {
            // Get the most recent fee
            Fee latestFee = fees.stream()
                .filter(fee -> fee.getExpiredAt() == null || fee.getExpiredAt().isAfter(java.time.LocalDateTime.now()))
                .findFirst()
                .orElse(fees.get(fees.size() - 1));
            return latestFee.getFeeStatus();
        }
        return this.feeStatus; // fallback to post's feeStatus
    }

    // Helper method to check if post has pending fees
    public boolean hasPendingFees() {
        return fees != null && fees.stream()
            .anyMatch(fee -> "PENDING".equals(fee.getFeeStatus()) && 
                (fee.getExpiredAt() == null || fee.getExpiredAt().isAfter(java.time.LocalDateTime.now())));
    }
}