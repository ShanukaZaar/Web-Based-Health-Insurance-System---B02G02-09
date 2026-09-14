package com.mlbb2g209.healthinsurance.claim;

import java.math.BigDecimal;

public class ClaimDTO {

    private Long id;
    private String claimNumber;
    private Long userId;
    private Long policyId;
    private BigDecimal claimAmount;
    private BigDecimal approvedAmount;
    private String status;
    private String description;

    public ClaimDTO() {
    }

    public ClaimDTO(Long id, String claimNumber, Long userId, Long policyId, BigDecimal claimAmount, BigDecimal approvedAmount, String status, String description) {
        this.id = id;
        this.claimNumber = claimNumber;
        this.userId = userId;
        this.policyId = policyId;
        this.claimAmount = claimAmount;
        this.approvedAmount = approvedAmount;
        this.status = status;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getClaimNumber() {
        return claimNumber;
    }

    public void setClaimNumber(String claimNumber) {
        this.claimNumber = claimNumber;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getPolicyId() {
        return policyId;
    }

    public void setPolicyId(Long policyId) {
        this.policyId = policyId;
    }

    public BigDecimal getClaimAmount() {
        return claimAmount;
    }

    public void setClaimAmount(BigDecimal claimAmount) {
        this.claimAmount = claimAmount;
    }

    public BigDecimal getApprovedAmount() {
        return approvedAmount;
    }

    public void setApprovedAmount(BigDecimal approvedAmount) {
        this.approvedAmount = approvedAmount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
