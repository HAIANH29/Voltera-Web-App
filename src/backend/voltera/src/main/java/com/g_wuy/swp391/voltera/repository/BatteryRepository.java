package com.g_wuy.swp391.voltera.repository;

import com.g_wuy.swp391.voltera.entity.Battery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BatteryRepository extends JpaRepository<Battery,Integer> {
}
