package com.mlbb2g209.healthinsurance.admin;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class ModuleReportSummaryDTO {

    private String reportType;
    private String title;
    private LocalDateTime generatedAt;
    private Map<String, Object> summaryStats;
    private List<Map<String, Object>> dataTable;

    public ModuleReportSummaryDTO() {
    }

    public ModuleReportSummaryDTO(String reportType, String title, LocalDateTime generatedAt, Map<String, Object> summaryStats, List<Map<String, Object>> dataTable) {
        this.reportType = reportType;
        this.title = title;
        this.generatedAt = generatedAt;
        this.summaryStats = summaryStats;
        this.dataTable = dataTable;
    }

    public String getReportType() {
        return reportType;
    }

    public void setReportType(String reportType) {
        this.reportType = reportType;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public LocalDateTime getGeneratedAt() {
        return generatedAt;
    }

    public void setGeneratedAt(LocalDateTime generatedAt) {
        this.generatedAt = generatedAt;
    }

    public Map<String, Object> getSummaryStats() {
        return summaryStats;
    }

    public void setSummaryStats(Map<String, Object> summaryStats) {
        this.summaryStats = summaryStats;
    }

    public List<Map<String, Object>> getDataTable() {
        return dataTable;
    }

    public void setDataTable(List<Map<String, Object>> dataTable) {
        this.dataTable = dataTable;
    }
}
