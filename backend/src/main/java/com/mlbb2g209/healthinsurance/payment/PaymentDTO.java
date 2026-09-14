package com.mlbb2g209.healthinsurance.payment;

import java.math.BigDecimal;

public class PaymentDTO {

    private Long id;
    private String transactionId;
    private Long userId;
    private Long policyId;
    private Long claimId;
    private BigDecimal amount;
    private String paymentMethod;
    private String status;

    public PaymentDTO() {
    }

    public PaymentDTO(Long id, String transactionId, Long userId, Long policyId, Long claimId, BigDecimal amount, String paymentMethod, String status) {
        this.id = id;
        this.transactionId = transactionId;
        this.userId = userId;
        this.policyId = policyId;
        this.claimId = claimId;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.status = status;
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
}
