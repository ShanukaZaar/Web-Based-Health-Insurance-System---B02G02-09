package com.mlbb2g209.healthinsurance.policy;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PolicyDTO {

    private Long id;
    private String policyNumber;
    private String title;
    private String description;
    private BigDecimal coverageAmount;
    private BigDecimal premiumAmount;
    private String policyType;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public PolicyDTO() {
    }

    public PolicyDTO(Long id, String policyNumber, String title, String description,
                     BigDecimal coverageAmount, BigDecimal premiumAmount,
                     String policyType, String status,
                     LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.policyNumber = policyNumber;
        this.title = title;
        this.description = description;
        this.coverageAmount = coverageAmount;
        this.premiumAmount = premiumAmount;
        this.policyType = policyType;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    /**
     * Factory method — converts a Policy entity to a PolicyDTO.
     */
    public static PolicyDTO fromEntity(Policy policy) {
        PolicyDTO dto = new PolicyDTO();
        dto.setId(policy.getId());
        dto.setPolicyNumber(policy.getPolicyNumber());
        dto.setTitle(policy.getTitle());
        dto.setDescription(policy.getDescription());
        dto.setCoverageAmount(policy.getCoverageAmount());
        dto.setPremiumAmount(policy.getPremiumAmount());
        dto.setPolicyType(policy.getPolicyType());
        dto.setStatus(policy.getStatus());
        dto.setCreatedAt(policy.getCreatedAt());
        dto.setUpdatedAt(policy.getUpdatedAt());
        return dto;
    }

    // -------- Getters & Setters --------

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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
