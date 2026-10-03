package com.mlbb2g209.healthinsurance.hospital;

import java.time.LocalDateTime;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class TreatmentRecordDTO {

    private Long id;
    private Long hospitalId;
    private Long userId;
    private Long policyId;
    private String diagnosis;
    private String treatmentNotes;
    private String documentPath;
    private LocalDateTime createdAt;

    

    public TreatmentRecordDTO() {
    }

    public TreatmentRecordDTO(Long id, Long hospitalId, Long userId, Long policyId, String diagnosis,
                                String treatmentNotes, String documentPath, LocalDateTime createdAt) {
        this.id = id;
        this.hospitalId = hospitalId;
        this.userId = userId;
        this.policyId = policyId;
        this.diagnosis = diagnosis;
        this.treatmentNotes = treatmentNotes;
        this.documentPath = documentPath;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getHospitalId() { return hospitalId; }
    public void setHospitalId(Long hospitalId) { this.hospitalId = hospitalId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getPolicyId() { return policyId; }
    public void setPolicyId(Long policyId) { this.policyId = policyId; }

    public String getDiagnosis() { return diagnosis; }
    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }

    public String getTreatmentNotes() { return treatmentNotes; }
    public void setTreatmentNotes(String treatmentNotes) { this.treatmentNotes = treatmentNotes; }

    public String getDocumentPath() { return documentPath; }
    public void setDocumentPath(String documentPath) { this.documentPath = documentPath; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    

}