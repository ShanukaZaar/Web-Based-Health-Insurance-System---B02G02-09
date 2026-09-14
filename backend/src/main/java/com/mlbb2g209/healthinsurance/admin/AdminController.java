package com.mlbb2g209.healthinsurance.admin;

import com.mlbb2g209.healthinsurance.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/reports")
    public ResponseEntity<ApiResponse<List<ReportDTO>>> getAllSystemReports() {
        List<ReportDTO> reports = adminService.getAllSystemReports();
        return ResponseEntity.ok(ApiResponse.success("System reports retrieved successfully", reports));
    }

    @PostMapping("/reports")
    public ResponseEntity<ApiResponse<ReportDTO>> generateReport(@RequestBody ReportDTO reportDTO) {
        ReportDTO report = adminService.generateReport(reportDTO);
        return ResponseEntity.ok(ApiResponse.success("System report generated successfully", report));
    }
}
