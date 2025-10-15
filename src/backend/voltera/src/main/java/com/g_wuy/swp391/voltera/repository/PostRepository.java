package com.g_wuy.swp391.voltera.repository;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.g_wuy.swp391.voltera.entity.Post;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Integer>, JpaSpecificationExecutor<Post> {
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

//    @Query("""
//            SELECT p FROM Post p
//            JOIN p.sellerId s
//            JOIN Vehicle v ON v.post = p
//            WHERE
//                ((p.price BETWEEN :minPrice AND :maxPrice)
//                OR LOWER(v.model) LIKE LOWER(CONCAT('%', :keyword, '%'))
//                OR LOWER(s.address) LIKE LOWER(CONCAT('%', :address, '%'))
//                OR LOWER(v.brand) LIKE LOWER(CONCAT('%', :brand, '%'))
//                OR LOWER(v.color) LIKE LOWER(CONCAT('%', :color, '%'))
//                OR LOWER(v.origin) LIKE LOWER(CONCAT('%', :origin, '%'))
//                OR LOWER(v.style) LIKE LOWER(CONCAT('%', :style, '%'))
//                OR v.bodyInsurance = :bodyInsurance
//                OR v.vehicleInspection = :vehicleInspection
//                OR v.yearManufacture BETWEEN :minYearManufacture AND :maxYearManufacture
//                OR v.numberOfSeat = :numberOfSeat)
//                AND (v.status = 'AVAILABLE')
//            """)
//    List<Post> filterVehiclePosts(@Param("keyword") String keyword,
//                                  @Param("minPrice") BigDecimal minPrice,
//                                  @Param("maxPrice") BigDecimal maxPrice,
//                                  @Param("address") String address,
//                                  @Param("brand") String brand,
//                                  @Param("color") String color,
//                                  @Param("origin") String origin,
//                                  @Param("style") String style,
//                                  @Param("bodyInsurance") boolean bodyInsurance,
//                                  @Param("vehicleInspection") boolean vehicleInspection,
//                                  @Param("minYearManufacture") int minYearManufacture,
//                                  @Param("maxYearManufacture") int maxYearManufacture,
//                                  @Param("numberOfSeat") int numberOfSeat);
}