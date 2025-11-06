package com.g_wuy.swp391.voltera.repository;

import com.g_wuy.swp391.voltera.entity.Refund;
import com.g_wuy.swp391.voltera.model.response.RefundResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RefundRepository extends JpaRepository<Refund, Integer> {


    @Query("SELECT " +
            "new com.g_wuy.swp391.voltera.model.response.RefundResponse(r.sender.fullname, r.receiver.fullname, t.price, r.reason, t.post.title, r.refundStatus, r.createdAt) " +
            "FROM Refund r " +
            "JOIN Transaction t ON r.transaction.transactionid = t.transactionid " +
            "WHERE r.sender.id = :senderId AND r.refundStatus = :status")
    List<RefundResponse> getRefundBySenderIdAndStatus(@Param("senderId") Integer senderId, @Param("status") String status);


    @Query("SELECT " +
            "new com.g_wuy.swp391.voltera.model.response.RefundResponse(r.sender.fullname, r.receiver.fullname, t.price, r.reason, t.post.title, r.refundStatus, r.createdAt) " +
            "FROM Refund r " +
            "JOIN Transaction t ON r.transaction.transactionid = t.transactionid " +
            "WHERE r.sender.id = :senderId")
    List<RefundResponse> getAllRefundBySenderId(@Param("senderId") Integer senderId);

    @Query("SELECT " +
            "new com.g_wuy.swp391.voltera.model.response.RefundResponse(r.sender.fullname, r.receiver.fullname, t.price, r.reason, t.post.title, r.refundStatus, r.createdAt) " +
            "FROM Refund r " +
            "JOIN Transaction t ON r.transaction.transactionid = t.transactionid " +
            "WHERE r.receiver.id = :receiverId AND r.refundStatus = :status")
    List<RefundResponse> getRefundByReceiverIdAndStatus(@Param("receiverId") Integer receiverId, @Param("status") String status);

    @Query("SELECT " +
            "new com.g_wuy.swp391.voltera.model.response.RefundResponse(r.sender.fullname, r.receiver.fullname, t.price, r.reason, t.post.title, r.refundStatus, r.createdAt) " +
            "FROM Refund r " +
            "JOIN Transaction t ON r.transaction.transactionid = t.transactionid " +
            "WHERE r.receiver.id = :receiverId")
    List<RefundResponse> getRefundByReceiverId(@Param("receiverId") Integer receiverId);
}