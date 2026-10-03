package com.mlbb2g209.healthinsurance.hospital;

import com.mlbb2g209.healthinsurance.common.BaseEntity;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "hospital_bills")
public class HospitalBill extends BaseEntity {

    @Column(name = "hospital_id", nullable = false)
    private Long hospitalId;

    @Column(name = "treatment_record_id", nullable = false)
    private Long treatmentRecordId;

    @Column(name = "bill_amount", nullable = false)
    private BigDecimal billAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private HospitalBillStatus status;

    @Column(name = "rejection_reason", length = 500)
    private String rejectionReason;

    public HospitalBill() {
    }

    public HospitalBill(Long hospitalId, Long treatmentRecordId, BigDecimal billAmount, HospitalBillStatus status) {
        this.hospitalId = hospitalId;
        this.treatmentRecordId = treatmentRecordId;
        this.billAmount = billAmount;
        this.status = status;
    }

    

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
    
    public Long getHospitalId() { return hospitalId; }
    public void setHospitalId(Long hospitalId) { this.hospitalId = hospitalId; }

    public Long getTreatmentRecordId() { return treatmentRecordId; }
    public void setTreatmentRecordId(Long treatmentRecordId) { this.treatmentRecordId = treatmentRecordId; }

    public BigDecimal getBillAmount() { return billAmount; }
    public void setBillAmount(BigDecimal billAmount) { this.billAmount = billAmount; }

    public HospitalBillStatus getStatus() { return status; }
    public void setStatus(HospitalBillStatus status) { this.status = status; }
}