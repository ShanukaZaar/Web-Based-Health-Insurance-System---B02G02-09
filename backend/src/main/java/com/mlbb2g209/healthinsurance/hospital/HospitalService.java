package com.mlbb2g209.healthinsurance.hospital;

import java.util.List;

public interface HospitalService {
    // --- Eligibility verification ---
    EligibilityResponseDTO verifyEligibility(Long policyId);

    // --- Hospital CRUD ---
    List<HospitalDTO> getAllHospitals();
    HospitalDTO getHospitalById(Long id);
    HospitalDTO createHospital(HospitalDTO dto);
    HospitalDTO updateHospital(Long id, HospitalDTO dto);
    void deleteHospital(Long id);

    // --- Treatment record CRUD ---
    List<TreatmentRecordDTO> getAllTreatmentRecords();
    TreatmentRecordDTO getTreatmentRecordById(Long id);
    TreatmentRecordDTO createTreatmentRecord(TreatmentRecordDTO dto);
    TreatmentRecordDTO updateTreatmentRecord(Long id, TreatmentRecordDTO dto);
    /** Soft delete — the record is withdrawn, not erased. */
    void withdrawTreatmentRecord(Long id);

    // --- Hospital bill CRUD ---
    List<HospitalBillDTO> getAllBills();
    HospitalBillDTO getBillById(Long id);
    HospitalBillDTO createBill(HospitalBillDTO dto);
    HospitalBillDTO updateBill(Long id, HospitalBillDTO dto);
    HospitalBillDTO submitBill(Long id);
    void deleteBill(Long id);
}
