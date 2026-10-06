package com.mlbb2g209.healthinsurance.admin;

import com.mlbb2g209.healthinsurance.common.ApiResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsDTO>> getDashboardStats() {
        DashboardStatsDTO stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Admin dashboard statistics retrieved successfully", stats));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserDTO>>> getAllUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean activeOnly,
            @RequestParam(required = false) String role) {
        List<UserDTO> users = adminService.getAllUsers(search, activeOnly, role);
        return ResponseEntity.ok(ApiResponse.success("User directory retrieved successfully", users));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<ApiResponse<UserDTO>> getUserById(@PathVariable Long id) {
        UserDTO user = adminService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success("User details retrieved successfully", user));
    }

    @PostMapping("/users")
    public ResponseEntity<ApiResponse<UserDTO>> createUser(
            @RequestBody java.util.Map<String, Object> body) {
        UserDTO dto = new UserDTO();
        dto.setUsername((String) body.get("username"));
        dto.setEmail((String) body.get("email"));
        dto.setFirstName((String) body.get("firstName"));
        dto.setLastName((String) body.get("lastName"));
        dto.setPhoneNumber((String) body.get("phoneNumber"));
        dto.setIsActive(body.get("isActive") == null || Boolean.TRUE.equals(body.get("isActive")));
        if (body.get("roles") instanceof java.util.List<?> rawList) {
            java.util.Set<String> roles = new java.util.HashSet<>();
            for (Object r : rawList) { if (r instanceof String s) roles.add(s); }
            dto.setRoles(roles);
        }
        String password = (String) body.getOrDefault("password", "changeme");
        UserDTO created = adminService.createUser(dto, password);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("User created successfully", created));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<ApiResponse<UserDTO>> updateUser(
            @PathVariable Long id,
            @RequestBody java.util.Map<String, Object> body) {
        UserDTO dto = new UserDTO();
        dto.setFirstName((String) body.get("firstName"));
        dto.setLastName((String) body.get("lastName"));
        dto.setEmail((String) body.get("email"));
        dto.setPhoneNumber((String) body.get("phoneNumber"));
        if (body.get("isActive") != null) dto.setIsActive(Boolean.TRUE.equals(body.get("isActive")));
        if (body.get("roles") instanceof java.util.List<?> rawList) {
            java.util.Set<String> roles = new java.util.HashSet<>();
            for (Object r : rawList) { if (r instanceof String s) roles.add(s); }
            dto.setRoles(roles);
        }
        UserDTO updated = adminService.updateUser(id, dto);
        return ResponseEntity.ok(ApiResponse.success("User updated successfully", updated));
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse<UserDTO>> updateUserStatus(
            @PathVariable Long id,
            @RequestParam Boolean active) {
        UserDTO updated = adminService.updateUserStatus(id, active);
        return ResponseEntity.ok(ApiResponse.success("User status updated successfully", updated));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully", null));
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

    @GetMapping("/reports/{id}")
    public ResponseEntity<ApiResponse<ReportDTO>> getReportById(@PathVariable Long id) {
        ReportDTO report = adminService.getReportById(id);
        return ResponseEntity.ok(ApiResponse.success("Report details retrieved successfully", report));
    }

    @DeleteMapping("/reports/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReport(@PathVariable Long id) {
        adminService.deleteReport(id);
        return ResponseEntity.ok(ApiResponse.success("Report deleted successfully", null));
    }

    @GetMapping("/reports/{id}/export")
    public ResponseEntity<byte[]> exportReportCsv(@PathVariable Long id) {
        byte[] csvData = adminService.exportReportCsv(id);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "report_" + id + ".csv");
        return ResponseEntity.ok().headers(headers).body(csvData);
    }

    @GetMapping("/reports/claims")
    public ResponseEntity<ApiResponse<ModuleReportSummaryDTO>> getClaimsReport() {
        ModuleReportSummaryDTO report = adminService.getClaimsReport();
        return ResponseEntity.ok(ApiResponse.success("Claim module report retrieved successfully", report));
    }

    @GetMapping("/reports/payments")
    public ResponseEntity<ApiResponse<ModuleReportSummaryDTO>> getPaymentsReport() {
        ModuleReportSummaryDTO report = adminService.getPaymentsReport();
        return ResponseEntity.ok(ApiResponse.success("Payment module report retrieved successfully", report));
    }

    @GetMapping("/reports/policies")
    public ResponseEntity<ApiResponse<ModuleReportSummaryDTO>> getPoliciesReport() {
        ModuleReportSummaryDTO report = adminService.getPoliciesReport();
        return ResponseEntity.ok(ApiResponse.success("Policy module report retrieved successfully", report));
    }

    @GetMapping("/reports/hospitals")
    public ResponseEntity<ApiResponse<ModuleReportSummaryDTO>> getHospitalsReport() {
        ModuleReportSummaryDTO report = adminService.getHospitalsReport();
        return ResponseEntity.ok(ApiResponse.success("Hospital module report retrieved successfully", report));
    }

    @GetMapping("/reports/support")
    public ResponseEntity<ApiResponse<ModuleReportSummaryDTO>> getSupportReport() {
        ModuleReportSummaryDTO report = adminService.getSupportReport();
        return ResponseEntity.ok(ApiResponse.success("Customer support module report retrieved successfully", report));
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<ApiResponse<List<AuditLogDTO>>> getAuditLogs() {
        List<AuditLogDTO> logs = adminService.getAuditLogs();
        return ResponseEntity.ok(ApiResponse.success("System audit logs retrieved successfully", logs));
    }
}
