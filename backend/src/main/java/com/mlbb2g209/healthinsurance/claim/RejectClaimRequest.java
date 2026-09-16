package com.mlbb2g209.healthinsurance.claim;

/**
 * Request body for PUT /api/claims/{id}/reject
 */
public class RejectClaimRequest {

    private String rejectionReason;

    public RejectClaimRequest() {
    }

    public RejectClaimRequest(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }
}