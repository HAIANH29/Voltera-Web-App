package com.g_wuy.swp391.voltera.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.g_wuy.swp391.voltera.entity.Battery;

@Repository
public interface BatteryRepository extends JpaRepository<Battery, Integer> {

    @Query("SELECT COUNT(b) > 0 FROM Battery b WHERE b.serialNumber = :serialNumber")
    boolean isSerialNumberExist(@Param("serialNumber") String serialNumber);
}
