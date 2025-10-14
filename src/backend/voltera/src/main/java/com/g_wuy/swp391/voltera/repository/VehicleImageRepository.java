package com.g_wuy.swp391.voltera.repository;

import com.g_wuy.swp391.voltera.entity.BatteryImage;
import com.g_wuy.swp391.voltera.entity.VehicleImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface VehicleImageRepository extends JpaRepository<VehicleImage,Integer> {
}
