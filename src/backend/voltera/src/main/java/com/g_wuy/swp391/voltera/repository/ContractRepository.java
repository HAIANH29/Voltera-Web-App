package com.g_wuy.swp391.voltera.repository;

import com.g_wuy.swp391.voltera.entity.Contract;
import com.g_wuy.swp391.voltera.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ContractRepository extends JpaRepository<Transaction, Integer> {
    @Query("SELECT c FROM Contract c WHERE c.postId.id = :postId AND (c.buyerId.id = :userId OR c.sellerId.id = :userId)")
    Contract findContractByPostIdAndUserId(@Param("postId") Integer postId,@Param("userId") Integer userId);
}