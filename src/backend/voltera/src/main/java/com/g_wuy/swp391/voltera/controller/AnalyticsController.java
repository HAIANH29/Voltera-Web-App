//package com.g_wuy.swp391.voltera.controller;
//
//import com.g_wuy.swp391.voltera.model.response.*;
//import com.g_wuy.swp391.voltera.service.AnalyticsService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/analytics")
//public class AnalyticsController {
//
//    @Autowired
//    private AnalyticsService service;
//
//    @GetMapping("/revenue/monthly")
//    public ResponseEntity<List<Object[]>> getRevenueByMonth() {
//        return ResponseEntity.ok(service.getRevenueByMonthAndYear());
//    }
//
//    @GetMapping("/brands/top")
//    public ResponseEntity<List<Object[]>> getTopBrands() {
//        return ResponseEntity.ok(service.getTopSellingBrands());
//    }
//
//    @GetMapping("/styles/top")
//    public ResponseEntity<List<Object[]>> getTopStyles() {
//        return ResponseEntity.ok(service.getTopVehicleStyles());
//    }
//
//    @GetMapping("/users/growth")
//    public ResponseEntity<List<Object[]>> getUserGrowth() {
//        return ResponseEntity.ok(service.getUserGrowthByMonth());
//    }
//
//    @GetMapping("/revenue/by-brand")
//    public ResponseEntity<List<Object[]>> getRevenueByBrand() {
//        return ResponseEntity.ok(service.getRevenueByBrand());
//    }
//
//    @GetMapping("/sellers/top")
//    public ResponseEntity<List<Object[]>> getTopSellers() {
//        return ResponseEntity.ok(service.getTopSellersByRevenue());
//    }
//}