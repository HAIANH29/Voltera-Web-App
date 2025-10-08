package com.g_wuy.swp391.voltera.repository;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.g_wuy.swp391.voltera.entity.Post;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Integer> {
    List<Post> findByStatus(String status);
    @Modifying
    @Transactional
    @Query("UPDATE Post p SET p.status = :status, p.updatedAt = CURRENT_TIMESTAMP WHERE p.id = :id")
    int updateStatusById(@Param("id") Integer id, @Param("status")String status);
    Optional<Post> findById(Integer id);

    @Query("SELECT p FROM Post p WHERE p.status = :status")
    List<Post> getAllPostByStatus(@Param("status") String status);

    @Query("SELECT p FROM Post p WHERE p.id = :id")
    Post findPostById(@Param("id") Integer id);
}