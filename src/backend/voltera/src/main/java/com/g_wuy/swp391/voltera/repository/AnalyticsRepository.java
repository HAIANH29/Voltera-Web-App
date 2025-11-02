//package com.g_wuy.swp391.voltera.repository;
//
//import com.g_wuy.swp391.voltera.model.response.*;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.CrudRepository;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//
//@Repository
//public interface AnalyticsRepository extends JpaRepository<Object, Long> {
//
//    // 1️⃣ Doanh thu theo tháng/năm
//    @Query("""
//        SELECT new com.g_wuy.swp391.voltera.model.response.TrendRevenueResponse(
//            EXTRACT(MONTH FROM t.createAt),
//            EXTRACT(YEAR FROM t.createAt),
//            SUM(t.price)
//        )
//        FROM Transaction t
//        WHERE t.transactionStatus = 'DONE'
//        GROUP BY EXTRACT(YEAR FROM t.createAt), EXTRACT(MONTH FROM t.createAt)
//        ORDER BY EXTRACT(YEAR FROM t.createAt), EXTRACT(MONTH FROM t.createAt)
//    """)
//    List<Object[]> findRevenueByMonthAndYear();
//
//    // 2️⃣ Top brand bán chạy nhất
//    @Query("""
//        SELECT new com.g_wuy.swp391.voltera.model.response.TrendBrandResponse(
//            v.brand, COUNT(t.transactionid)
//        )
//        FROM Transaction t
//        JOIN Post p ON t.post.id = p.id
//        JOIN Vehicle v ON p.id = v.post.id
//        WHERE t.transactionStatus = 'DONE'
//        GROUP BY v.brand
//        ORDER BY COUNT(t.transactionid) DESC
//    """)
//    List<Object[]> findTopSellingBrands();
//
//    // 3️⃣ Loại xe bán chạy nhất (SUV, Sedan, …)
//    @Query("""
//        SELECT new com.g_wuy.swp391.voltera.model.response.TrendStyleResponse(
//            v.style, COUNT(t.transactionid)
//        )
//        FROM Transaction t
//        JOIN Post p ON t.post.id = p.id
//        JOIN Vehicle v ON v.post.id = p.id
//        WHERE t.transactionStatus = 'DONE'
//        GROUP BY v.style
//        ORDER BY COUNT(t.transactionid) DESC
//    """)
//    List<Object[]> findTopVehicleStyles();
//
//    // 4️⃣ Số lượng người dùng đăng ký theo tháng/năm
//    @Query("""
//        SELECT new com.g_wuy.swp391.voltera.model.response.TrendUserGrowthResponse(
//            EXTRACT(MONTH FROM u.createAt),
//            EXTRACT(YEAR FROM u.createAt),
//            COUNT(u.id)
//        )
//        FROM User u
//        GROUP BY EXTRACT(YEAR FROM u.createAt), EXTRACT(MONTH FROM u.createAt)
//        ORDER BY EXTRACT(YEAR FROM u.createAt), EXTRACT(MONTH FROM u.createAt)
//    """)
//    List<Object[]> findUserGrowthByMonth();
//
//    // 5️⃣ Doanh thu theo hãng xe
//    @Query("""
//        SELECT new com.g_wuy.swp391.voltera.model.response.TrendBrandRevenueResponse(
//            v.brand, SUM(t.price)
//        )
//        FROM Transaction t
//        JOIN Post p ON t.post.id = p.id
//        JOIN Vehicle v ON v.post.id = p.id
//        WHERE t.transactionStatus = 'DONE'
//        GROUP BY v.brand
//        ORDER BY SUM(t.price) DESC
//    """)
//    List<Object[]> findRevenueByBrand();
//
//    // 6️⃣ Top seller doanh thu cao nhất
//    @Query("""
//        SELECT new com.g_wuy.swp391.voltera.model.response.TrendSellerResponse(
//            u.fullname, SUM(t.price)
//        )
//        FROM Transaction t
//        JOIN Post p ON t.post.id = p.id
//        JOIN User u ON p.id = u.id
//        WHERE t.transactionStatus = 'DONE'
//        GROUP BY u.fullname
//        ORDER BY SUM(t.price) DESC
//    """)
//    List<Object[]> findTopSellersByRevenue();
//}
