package com.g_wuy.swp391.voltera.repository;

import com.g_wuy.swp391.voltera.entity.Batterytype;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BatterytypeRepository extends JpaRepository<Batterytype, Integer> {
    public Batterytype findBatterytypeById(int id);
}
