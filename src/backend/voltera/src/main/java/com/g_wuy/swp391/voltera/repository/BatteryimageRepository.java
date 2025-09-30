package com.g_wuy.swp391.voltera.repository;

import com.g_wuy.swp391.voltera.entity.Batteryimage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BatteryimageRepository extends JpaRepository<Batteryimage,Integer> {
}
