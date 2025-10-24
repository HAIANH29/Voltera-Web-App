package com.g_wuy.swp391.voltera.controller;

import com.g_wuy.swp391.voltera.model.request.ContractRequest;
import com.g_wuy.swp391.voltera.model.response.ContractResponse;
import com.g_wuy.swp391.voltera.service.ContractService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/contract")
public class ContractController {
    @Autowired
    private ContractService contractService;
    @PostMapping("/create")
    public ResponseEntity<ContractResponse> createContract(@RequestBody ContractRequest request) {
        return ResponseEntity.ok(contractService.createContract(request));
    }

    @PutMapping("/{id}/terms")
    public ResponseEntity<ContractResponse> updateTerms(@PathVariable Integer id,
                                                        @RequestParam String newTerms) {
        return ResponseEntity.ok(contractService.updateTerms(id, newTerms));
    }

    @PutMapping("/{id}/sign")
    public ResponseEntity<ContractResponse> signContract(@PathVariable Integer id,
                                                         @RequestParam Integer userId) {
        return ResponseEntity.ok(contractService.signContract(id, userId));
    }

}
