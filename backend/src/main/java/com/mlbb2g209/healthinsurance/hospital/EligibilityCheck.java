package com.mlbb2g209.healthinsurance.hospital;

import java.math.BigDecimal;

public class EligibilityCheck {

    private boolean eligible;
    private String policyStatus;
    private BigDecimal remainingCoverage;
    private String message;

    public EligibilityCheck() {
    }

    public EligibilityCheck(boolean eligible, String policyStatus, BigDecimal remainingCoverage, String message) {
        this.eligible = eligible;
        this.policyStatus = policyStatus;
        this.remainingCoverage = remainingCoverage;
        this.message = message;
    }

    public boolean isEligible() { return eligible; }
    public void setEligible(boolean eligible) { this.eligible = eligible; }

    public String getPolicyStatus() { return policyStatus; }
    public void setPolicyStatus(String policyStatus) { this.policyStatus = policyStatus; }

    public BigDecimal getRemainingCoverage() { return remainingCoverage; }
    public void setRemainingCoverage(BigDecimal remainingCoverage) { this.remainingCoverage = remainingCoverage; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}