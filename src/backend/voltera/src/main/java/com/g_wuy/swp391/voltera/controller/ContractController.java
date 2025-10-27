package com.g_wuy.swp391.voltera.controller;

import com.g_wuy.swp391.voltera.model.request.ContractRequest;
import com.g_wuy.swp391.voltera.model.response.ContractResponse;
import com.g_wuy.swp391.voltera.model.response.TransactionResponse;
import com.g_wuy.swp391.voltera.service.ContractService;
import com.g_wuy.swp391.voltera.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contract")
public class ContractController {

    @Autowired
    private ContractService contractService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/create")
    public ResponseEntity<ContractResponse> createContract(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody ContractRequest request) {

        String token = authHeader.substring(7);
        String username = jwtService.extractUsername(token);

        return ResponseEntity.ok(contractService.createContract(request, username));
    }

    @PutMapping("/{id}/sign")
    public ResponseEntity<ContractResponse> signContract(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Integer id) {

        String token = authHeader.substring(7);
        String username = jwtService.extractUsername(token);

        ContractResponse response = contractService.signContract(username, id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ContractResponse> cancelContract(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Integer id) {

        String token = authHeader.substring(7);
        String username = jwtService.extractUsername(token);

        ContractResponse response = contractService.cancelContract(username, id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContractResponse> getContractById(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Integer id) {

        String token = authHeader.substring(7);
        String username = jwtService.extractUsername(token);

        ContractResponse response = contractService.getContractById(id, username);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/list")
    public ResponseEntity<List<ContractResponse>> getContracts(
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.substring(7);
        String username = jwtService.extractUsername(token);

        return ResponseEntity.ok(contractService.getContractsForUser(username));
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<TransactionResponse>> getTransactions(
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.substring(7);
        String username = jwtService.extractUsername(token);

        return ResponseEntity.ok(contractService.getTransactionsForUser(username));
    }
}
