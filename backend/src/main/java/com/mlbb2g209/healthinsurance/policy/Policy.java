package com.mlbb2g209.healthinsurance.policy;

import com.mlbb2g209.healthinsurance.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "policies")
public class Policy extends BaseEntity {

    @Column(name = "policy_number", nullable = false, unique = true)
    private String policyNumber;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "coverage_amount", nullable = false)
    private BigDecimal coverageAmount;

    @Column(name = "premium_amount", nullable = false)
    private BigDecimal premiumAmount;

    @Column(name = "policy_type", nullable = false)
    private String policyType;

    @Column(name = "status")
    private String status;

    public Policy() {
    }

    public Policy(String policyNumber, String title, String description, BigDecimal coverageAmount, BigDecimal premiumAmount, String policyType, String status) {
        this.policyNumber = policyNumber;
        this.title = title;
        this.description = description;
        this.coverageAmount = coverageAmount;
        this.premiumAmount = premiumAmount;
        this.policyType = policyType;
        this.status = status;
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
