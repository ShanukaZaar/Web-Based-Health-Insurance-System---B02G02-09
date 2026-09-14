package com.mlbb2g209.healthinsurance.claim;

import com.mlbb2g209.healthinsurance.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "claims")
public class Claim extends BaseEntity {

    @Column(name = "claim_number", nullable = false, unique = true)
    private String claimNumber;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "policy_id", nullable = false)
    private Long policyId;

    @Column(name = "claim_amount", nullable = false)
    private BigDecimal claimAmount;

    @Column(name = "approved_amount")
    private BigDecimal approvedAmount;

    @Column(name = "status")
    private String status;

    @Column(name = "description", length = 1000)
    private String description;

    public Claim() {
    }

    public Claim(String claimNumber, Long userId, Long policyId, BigDecimal claimAmount, BigDecimal approvedAmount, String status, String description) {
        this.claimNumber = claimNumber;
        this.userId = userId;
        this.policyId = policyId;
        this.claimAmount = claimAmount;
        this.approvedAmount = approvedAmount;
        this.status = status;
        this.description = description;
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
