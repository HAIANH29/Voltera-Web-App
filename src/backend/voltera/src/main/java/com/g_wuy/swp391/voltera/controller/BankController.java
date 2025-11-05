package com.g_wuy.swp391.voltera.controller;

import com.g_wuy.swp391.voltera.model.request.BankRequest;
import com.g_wuy.swp391.voltera.service.BankService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bank")
public class BankController {

    @Autowired
    private BankService bankService;

    @GetMapping("/{status}")
    private ResponseEntity<List<BankResponse>> findAllByStatus(@PathVariable("status") String status) {
        return ResponseEntity.ok(bankService.getAllBank(status).getBody());
    }

    @PostMapping("/save-bank")
    private ResponseEntity<BankResponse> saveBank(
            @RequestHeader("Authorization") String jwt,
            @RequestBody BankRequest request) {
        return ResponseEntity.ok(bankService.saveBank(request, jwt).getBody());
    }

    @GetMapping("/my-bank")
    private ResponseEntity<BankResponse> getBank(@RequestHeader("Authorization") String jwt) {
        return ResponseEntity.ok(bankService.myBanks(jwt).getBody());
    }
}