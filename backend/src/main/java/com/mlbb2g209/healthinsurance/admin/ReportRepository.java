package com.mlbb2g209.healthinsurance.admin;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByReportType(String reportType);
    List<Report> findByGeneratedBy(Long generatedBy);
}
