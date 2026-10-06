package com.mlbb2g209.healthinsurance.claim;

import java.math.BigDecimal;

/**
 * Request body for PUT /api/claims/{id}/approve
 */
public class ApproveClaimRequest {

    private BigDecimal approvedAmount;

    public ApproveClaimRequest() {
    }

    public ApproveClaimRequest(BigDecimal approvedAmount) {
        this.approvedAmount = approvedAmount;
    }

    public BigDecimal getApprovedAmount() {
        return approvedAmount;
    }

    public void setApprovedAmount(BigDecimal approvedAmount) {
        this.approvedAmount = approvedAmount;
    }
}