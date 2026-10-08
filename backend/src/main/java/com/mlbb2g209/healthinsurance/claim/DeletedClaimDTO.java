package com.mlbb2g209.healthinsurance.claim;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class DeletedClaimDTO {

    private Long id;
    private Long originalClaimId;
    private String claimNumber;
    private Long userId;
    private Long policyId;
    private BigDecimal claimAmount;
    private BigDecimal approvedAmount;
    private String status;
    private String description;
    private String documentPath;
    private String rejectionReason;
    private LocalDateTime reviewedAt;
    private LocalDateTime originalCreatedAt;
    private LocalDateTime deletedAt;

    public DeletedClaimDTO() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOriginalClaimId() { return originalClaimId; }
    public void setOriginalClaimId(Long originalClaimId) { this.originalClaimId = originalClaimId; }

    public String getClaimNumber() { return claimNumber; }
    public void setClaimNumber(String claimNumber) { this.claimNumber = claimNumber; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getPolicyId() { return policyId; }
    public void setPolicyId(Long policyId) { this.policyId = policyId; }

    public BigDecimal getClaimAmount() { return claimAmount; }
    public void setClaimAmount(BigDecimal claimAmount) { this.claimAmount = claimAmount; }

    public BigDecimal getApprovedAmount() { return approvedAmount; }
    public void setApprovedAmount(BigDecimal approvedAmount) { this.approvedAmount = approvedAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDocumentPath() { return documentPath; }
    public void setDocumentPath(String documentPath) { this.documentPath = documentPath; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public LocalDateTime getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(LocalDateTime reviewedAt) { this.reviewedAt = reviewedAt; }

    public LocalDateTime getOriginalCreatedAt() { return originalCreatedAt; }
    public void setOriginalCreatedAt(LocalDateTime originalCreatedAt) { this.originalCreatedAt = originalCreatedAt; }

    public LocalDateTime getDeletedAt() { return deletedAt; }
    public void setDeletedAt(LocalDateTime deletedAt) { this.deletedAt = deletedAt; }
}