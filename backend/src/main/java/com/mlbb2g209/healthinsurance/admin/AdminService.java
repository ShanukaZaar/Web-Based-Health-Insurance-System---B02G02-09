package com.mlbb2g209.healthinsurance.admin;

import java.util.List;

public interface AdminService {

    DashboardStatsDTO getDashboardStats();

    List<UserDTO> getAllUsers(String search, Boolean activeOnly, String role);

    UserDTO getUserById(Long id);

    UserDTO createUser(UserDTO userDTO, String password);

    UserDTO updateUser(Long id, UserDTO userDTO);

    UserDTO updateUserStatus(Long id, Boolean active);

    void deleteUser(Long id);

    List<ReportDTO> getAllSystemReports();

    ReportDTO generateReport(ReportDTO reportDTO);

    ReportDTO getReportById(Long id);

    void deleteReport(Long id);

    byte[] exportReportCsv(Long id);

    ModuleReportSummaryDTO getClaimsReport();

    ModuleReportSummaryDTO getPaymentsReport();

    ModuleReportSummaryDTO getPoliciesReport();

    ModuleReportSummaryDTO getHospitalsReport();

    ModuleReportSummaryDTO getSupportReport();

    List<AuditLogDTO> getAuditLogs();
}
