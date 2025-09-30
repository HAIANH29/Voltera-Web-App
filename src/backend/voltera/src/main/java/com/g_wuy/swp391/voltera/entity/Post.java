package com.g_wuy.swp391.voltera.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "post")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "postid", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sellerid")
    private User sellerid;

    @Size(max = 200)
    @Column(name = "title", length = 200)
    private String title;

    @Column(name = "description", length = Integer.MAX_VALUE)
    private String description;

    @Column(name = "price", precision = 12, scale = 2)
    private BigDecimal price;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "createdat")
    private Instant createdat;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "updatedat")
    private Instant updatedat;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 50, nullable = false)
    private PostStatus status = PostStatus.PENDING;

    public enum PostStatus {
        PENDING, APPROVE, REJECT
    }

    @PrePersist
    protected void onCreate() {
        createdat = Instant.now();
        updatedat = Instant.now();
        if (status == null) {
            status = PostStatus.PENDING;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedat = Instant.now();
    }
}
