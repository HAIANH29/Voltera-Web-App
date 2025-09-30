package com.g_wuy.swp391.voltera.repository;

import com.g_wuy.swp391.voltera.entity.Vehicleimage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VehicleImageRepository extends JpaRepository<Vehicleimage,Integer> {
}
