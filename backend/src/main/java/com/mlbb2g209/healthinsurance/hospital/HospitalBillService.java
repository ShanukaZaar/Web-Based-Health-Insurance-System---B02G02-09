package com.mlbb2g209.healthinsurance.hospital;

import java.util.List;

public interface HospitalBillService {
    List<HospitalBillDTO> getAllBills();
    HospitalBillDTO getBillById(Long id);
    List<HospitalBillDTO> getBillsByHospital(Long hospitalId);
    List<HospitalBillDTO> getBillsByStatus(String status);
    List<HospitalBillDTO> getBillsByTreatmentRecord(Long treatmentRecordId);
    HospitalBillDTO submitBill(HospitalBillDTO dto);
    HospitalBillDTO markUnderReview(Long id);
    HospitalBillDTO approveBill(Long id);
    HospitalBillDTO rejectBill(Long id, String rejectionReason);
}