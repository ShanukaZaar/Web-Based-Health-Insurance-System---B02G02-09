package com.mlbb2g209.healthinsurance.hospital;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class HospitalBillDTO {

    private Long id;
    private Long hospitalId;
    private Long treatmentRecordId;
    private BigDecimal billAmount;
    private String status;
    private LocalDateTime createdAt;
    private String rejectionReason;

    public HospitalBillDTO() {
    }

    public HospitalBillDTO(Long id, Long hospitalId, Long treatmentRecordId, BigDecimal billAmount,
                            String status, LocalDateTime createdAt) {
        this.id = id;
        this.hospitalId = hospitalId;
        this.treatmentRecordId = treatmentRecordId;
        this.billAmount = billAmount;
        this.status = status;
        this.createdAt = createdAt;
    }

    

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getHospitalId() { return hospitalId; }
    public void setHospitalId(Long hospitalId) { this.hospitalId = hospitalId; }

    public Long getTreatmentRecordId() { return treatmentRecordId; }
    public void setTreatmentRecordId(Long treatmentRecordId) { this.treatmentRecordId = treatmentRecordId; }

    public BigDecimal getBillAmount() { return billAmount; }
    public void setBillAmount(BigDecimal billAmount) { this.billAmount = billAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}