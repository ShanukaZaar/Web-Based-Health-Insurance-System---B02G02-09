package com.mlbb2g209.healthinsurance.admin;

import com.mlbb2g209.healthinsurance.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "reports")
public class Report extends BaseEntity {

    @Column(name = "report_title", nullable = false)
    private String reportTitle;

    @Column(name = "report_type", nullable = false)
    private String reportType;

    @Column(name = "generated_by", nullable = false)
    private Long generatedBy;

    @Column(name = "file_path")
    private String filePath;

    public Report() {
    }

    public Report(String reportTitle, String reportType, Long generatedBy, String filePath) {
        this.reportTitle = reportTitle;
        this.reportType = reportType;
        this.generatedBy = generatedBy;
        this.filePath = filePath;
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
}
