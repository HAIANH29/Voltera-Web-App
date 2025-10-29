package com.g_wuy.swp391.voltera.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "complaint_reply")
public class ComplaintReply {
    @Id
    @Column(name = "replyid", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "complaintid")
    private Complaint complaintId;//

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "senderid")
    private User senderId;//

    @NotNull
    @Column(name = "message", nullable = false, length = Integer.MAX_VALUE)
    private String message;//

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "createdat")
    private Instant createdAt;//

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "receiverid")
    private User receiverId;//

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "resolveat")
    private Instant resolveAt;//

}