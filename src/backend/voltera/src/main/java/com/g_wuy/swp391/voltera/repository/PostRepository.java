package com.g_wuy.swp391.voltera.repository;

import com.g_wuy.swp391.voltera.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post,Integer> {
    List<Post> findByStatus(Post.PostStatus status);
    @Modifying
    @Query("UPDATE Post p SET p.status = :status, p.updatedat = CURRENT_TIMESTAMP WHERE p.id = :id")
    void updateStatusById(@Param("id") Integer id, @Param("status")String status);
    Optional<Post> findById(Integer id);
}