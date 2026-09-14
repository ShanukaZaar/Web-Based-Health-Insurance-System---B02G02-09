package com.mlbb2g209.healthinsurance.admin;

import java.util.List;

public interface AdminService {
    List<ReportDTO> getAllSystemReports();
    ReportDTO generateReport(ReportDTO reportDTO);
}
