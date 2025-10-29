package com.g_wuy.swp391.voltera.repository;

import com.g_wuy.swp391.voltera.entity.Transaction;
import com.g_wuy.swp391.voltera.model.response.TransactionResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Integer> {
    @Query("""
        SELECT t FROM Transaction t
        WHERE 
            (t.contractid.buyerid.id IN (SELECT a.user.id FROM Account a WHERE a.username = :username)
             OR t.contractid.sellerid.id IN (SELECT a.user.id FROM Account a WHERE a.username = :username))
            AND t.transactionStatus IN ('PENDING', 'FAIL', 'DONE')
    """)
    List<Transaction> findTransactionsByUser(@Param("username") String username);

    @Query("SELECT new com.g_wuy.swp391.voltera.model.response.TransactionResponse(t.transactionid, t.post.title, t.post.price, t.transactionStatus, t.createAt, t.updateAt) FROM Transaction t " +
            "JOIN Contract c ON t.contractid.id = c.id " +
            "JOIN User u ON c.buyerid.id = u.id " +
            "WHERE t.transactionStatus IN ('PENDING','DONE','FAILED') " +
            "AND u.id = :userId " +
            "AND t.transactionStatus = :status")
    List<TransactionResponse> findTransactionByStatus(@Param("userId") Integer userId,@Param("status") String status);

}