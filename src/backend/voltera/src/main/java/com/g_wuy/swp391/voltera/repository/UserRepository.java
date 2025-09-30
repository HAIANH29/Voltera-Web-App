package com.g_wuy.swp391.voltera.repository;

import com.g_wuy.swp391.voltera.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,String> {
    Optional<User> findById(Integer id);

    Optional<User> findUserById(Integer id);
}
