package com.g_wuy.swp391.voltera.controller;
import com.g_wuy.swp391.voltera.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reports")

public class ReportController {
  @Autowired
  private ReportService reportService;


    @PostMapping("/generate")
    @PreAuthorize("hasRole('ADMIN')")
    public ReportResponse generateReportManually() {
        LocalDate now = LocalDate.now();
        return reportService.createOrUpdateReport(now.getMonthValue(), now.getYear());
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<ReportResponse> getAllReports() {
        return reportService.getAllReports();
    }

    @GetMapping("/{month}/{year}")
    @PreAuthorize("hasRole('ADMIN')")
    public ReportResponse getByMonthYear(@PathVariable Integer month, @PathVariable Integer year) {
        return reportService.getByMonthYear(month, year);
    }
}
