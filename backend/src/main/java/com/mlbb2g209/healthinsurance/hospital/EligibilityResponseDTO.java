package com.mlbb2g209.healthinsurance.hospital;

public class EligibilityResponseDTO {
    private boolean eligible;
    private String message;

    public EligibilityResponseDTO() {
    }

    public EligibilityResponseDTO(boolean eligible, String message) {
        this.eligible = eligible;
        this.message = message;
    }

    public boolean isEligible() {
        return eligible;
    }

    public void setEligible(boolean eligible) {
        this.eligible = eligible;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
