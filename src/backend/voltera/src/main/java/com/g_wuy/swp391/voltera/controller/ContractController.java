package com.g_wuy.swp391.voltera.controller;

import com.g_wuy.swp391.voltera.model.request.ContractRequest;
import com.g_wuy.swp391.voltera.model.response.ContractResponse;
import com.g_wuy.swp391.voltera.service.ContractService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contract")
public class ContractController {
    @Autowired
    private ContractService contractService;
    @PostMapping("/create")
    public ResponseEntity<ContractResponse> createContract(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody ContractRequest request) {
        return ResponseEntity.ok(contractService.createContract(request, authHeader));
    }

    @PutMapping("/{id}/terms")
    public ResponseEntity<ContractResponse> updateTerms( @RequestHeader("Authorization") String authHeader,
            @PathVariable Integer id,
                                                        @RequestParam String newTerms) {
        ContractResponse response = contractService.updateTerms(authHeader, id, newTerms);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/sign")
    public ResponseEntity<ContractResponse> signContract( @RequestHeader("Authorization") String authHeader
            ,@PathVariable Integer id) {
        ContractResponse response = contractService.signContract(authHeader, id);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/{id}")
    public ResponseEntity<ContractResponse> getContract(@PathVariable Integer id) {
        ContractResponse response = contractService.getContractById(id);
        return ResponseEntity.ok(response);
    }
}
