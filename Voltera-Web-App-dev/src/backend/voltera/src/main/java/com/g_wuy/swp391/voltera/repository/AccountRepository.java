package com.g_wuy.swp391.voltera.repository;

import com.g_wuy.swp391.voltera.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    Account findByUsername(String username);
    boolean existsByUsername(String username);
    Account findById(Integer id);
}
