package com.mlbb2g209.healthinsurance.admin;

import java.time.LocalDateTime;

public class ReportDTO {

    private Long id;
    private String reportTitle;
    private String reportType;
    private Long generatedBy;
    private String filePath;
    private LocalDateTime createdAt;

    public ReportDTO() {
    }

    public ReportDTO(Long id, String reportTitle, String reportType, Long generatedBy, String filePath, LocalDateTime createdAt) {
        this.id = id;
        this.reportTitle = reportTitle;
        this.reportType = reportType;
        this.generatedBy = generatedBy;
        this.filePath = filePath;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getReportTitle() {
        return reportTitle;
    }

    public void setReportTitle(String reportTitle) {
        this.reportTitle = reportTitle;
    }

    public String getReportType() {
        return reportType;
    }

    public void setReportType(String reportType) {
        this.reportType = reportType;
    }

    public Long getGeneratedBy() {
        return generatedBy;
    }

    public void setGeneratedBy(Long generatedBy) {
        this.generatedBy = generatedBy;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
