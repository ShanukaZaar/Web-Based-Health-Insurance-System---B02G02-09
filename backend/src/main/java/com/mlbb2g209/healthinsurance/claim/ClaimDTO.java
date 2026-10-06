package com.mlbb2g209.healthinsurance.claim;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ClaimDTO {

    private Long id;
    private String claimNumber;

    @NotNull(message = "userId is required")
    private Long userId;

    @NotNull(message = "policyId is required")
    private Long policyId;

    @NotNull(message = "claimAmount is required")
    @Positive(message = "claimAmount must be greater than zero")
    private BigDecimal claimAmount;

    private BigDecimal approvedAmount;
    private String status;

    @NotBlank(message = "description is required")
    private String description;

    private String documentPath;
    private String rejectionReason;
    private LocalDateTime reviewedAt;
    private LocalDateTime createdAt;

    public ClaimDTO() {
    }

    public ClaimDTO(Long id, String claimNumber, Long userId, Long policyId, BigDecimal claimAmount,
                     BigDecimal approvedAmount, String status, String description, String documentPath,
                     String rejectionReason, LocalDateTime reviewedAt, LocalDateTime createdAt) {
        this.id = id;
        this.claimNumber = claimNumber;
        this.userId = userId;
        this.policyId = policyId;
        this.claimAmount = claimAmount;
        this.approvedAmount = approvedAmount;
        this.status = status;
        this.description = description;
        this.documentPath = documentPath;
        this.rejectionReason = rejectionReason;
        this.reviewedAt = reviewedAt;
        this.createdAt = createdAt;
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

    public String getDocumentPath() {
        return documentPath;
    }

    public void setDocumentPath(String documentPath) {
        this.documentPath = documentPath;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public LocalDateTime getReviewedAt() {
        return reviewedAt;
    }

    public void setReviewedAt(LocalDateTime reviewedAt) {
        this.reviewedAt = reviewedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}