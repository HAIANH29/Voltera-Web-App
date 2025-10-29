package com.g_wuy.swp391.voltera.repository;

import com.g_wuy.swp391.voltera.entity.Transaction;
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

}
