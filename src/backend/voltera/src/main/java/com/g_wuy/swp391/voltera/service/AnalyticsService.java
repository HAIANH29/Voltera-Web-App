//package com.g_wuy.swp391.voltera.service;
//
//import com.g_wuy.swp391.voltera.model.response.*;
//import com.g_wuy.swp391.voltera.repository.AnalyticsRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//public class AnalyticsService {
//    @Autowired
//    private AnalyticsRepository repo;
//
//    public List<Object[]> getRevenueByMonthAndYear() {
//        return repo.findRevenueByMonthAndYear();
//    }
//
//    public List<Object[]> getTopSellingBrands() {
//        return repo.findTopSellingBrands();
//    }
//
//    public List<Object[]> getTopVehicleStyles() {
//        return repo.findTopVehicleStyles();
//    }
//
//    public List<Object[]> getUserGrowthByMonth() {
//        return repo.findUserGrowthByMonth();
//    }
//
//    public List<Object[]> getRevenueByBrand() {
//        return repo.findRevenueByBrand();
//    }
//
//    public List<Object[]> getTopSellersByRevenue() {
//        return repo.findTopSellersByRevenue();
//    }
//}
