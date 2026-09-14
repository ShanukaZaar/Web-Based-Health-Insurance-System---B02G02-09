package com.mlbb2g209.healthinsurance.policy;

import java.math.BigDecimal;

public class PolicyDTO {

    private Long id;
    private String policyNumber;
    private String title;
    private String description;
    private BigDecimal coverageAmount;
    private BigDecimal premiumAmount;
    private String policyType;
    private String status;

    public PolicyDTO() {
    }

    public PolicyDTO(Long id, String policyNumber, String title, String description, BigDecimal coverageAmount, BigDecimal premiumAmount, String policyType, String status) {
        this.id = id;
        this.policyNumber = policyNumber;
        this.title = title;
        this.description = description;
        this.coverageAmount = coverageAmount;
        this.premiumAmount = premiumAmount;
        this.policyType = policyType;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPolicyNumber() {
        return policyNumber;
    }

    public void setPolicyNumber(String policyNumber) {
        this.policyNumber = policyNumber;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getCoverageAmount() {
        return coverageAmount;
    }

    public void setCoverageAmount(BigDecimal coverageAmount) {
        this.coverageAmount = coverageAmount;
    }

    public BigDecimal getPremiumAmount() {
        return premiumAmount;
    }

    public void setPremiumAmount(BigDecimal premiumAmount) {
        this.premiumAmount = premiumAmount;
    }

    public String getPolicyType() {
        return policyType;
    }

    public void setPolicyType(String policyType) {
        this.policyType = policyType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
