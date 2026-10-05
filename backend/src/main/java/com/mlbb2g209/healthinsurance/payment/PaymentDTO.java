package com.mlbb2g209.healthinsurance.payment;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Data Transfer Object for Payment requests and responses.
 * Belongs to Module: Premium Payment Management (Lakshani J.D.C.)
 */
public class PaymentDTO {

    private Long id;
    private String transactionId;
    private String receiptNumber;
    private Long userId;
    private Long policyId;
    private Long claimId;
    private BigDecimal amount;
    private String paymentMethod;
    private String status;
    private LocalDateTime paymentDate;
    private String description;
    private String refundReason;
    private LocalDateTime refundDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public PaymentDTO() {
    }

    public PaymentDTO(Long id, String transactionId, String receiptNumber, Long userId, Long policyId,
                      Long claimId, BigDecimal amount, String paymentMethod, String status,
                      LocalDateTime paymentDate, String description, String refundReason,
                      LocalDateTime refundDate, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.transactionId = transactionId;
        this.receiptNumber = receiptNumber;
        this.userId = userId;
        this.policyId = policyId;
        this.claimId = claimId;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.status = status;
        this.paymentDate = paymentDate;
        this.description = description;
        this.refundReason = refundReason;
        this.refundDate = refundDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public String getReceiptNumber() {
        return receiptNumber;
    }

    public void setReceiptNumber(String receiptNumber) {
        this.receiptNumber = receiptNumber;
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

    public Long getClaimId() {
        return claimId;
    }

    public void setClaimId(Long claimId) {
        this.claimId = claimId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDateTime paymentDate) {
        this.paymentDate = paymentDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getRefundReason() {
        return refundReason;
    }

    public void setRefundReason(String refundReason) {
        this.refundReason = refundReason;
    }

    public LocalDateTime getRefundDate() {
        return refundDate;
    }

    public void setRefundDate(LocalDateTime refundDate) {
        this.refundDate = refundDate;
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

    public static class RefundRequest {
        private String refundReason;

        public RefundRequest() {
        }

        public RefundRequest(String refundReason) {
            this.refundReason = refundReason;
        }

        public String getRefundReason() {
            return refundReason;
        }

        public void setRefundReason(String refundReason) {
            this.refundReason = refundReason;
        }
    }
}
