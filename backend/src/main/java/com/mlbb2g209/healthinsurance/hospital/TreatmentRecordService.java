package com.mlbb2g209.healthinsurance.hospital;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface TreatmentRecordService {
    List<TreatmentRecordDTO> getAllTreatmentRecords();
    TreatmentRecordDTO getTreatmentRecordById(Long id);
    List<TreatmentRecordDTO> getByHospital(Long hospitalId);
    List<TreatmentRecordDTO> getByUser(Long userId);
    List<TreatmentRecordDTO> getByPolicy(Long policyId);
    TreatmentRecordDTO createTreatmentRecord(TreatmentRecordDTO dto);
    TreatmentRecordDTO uploadDocument(Long id, MultipartFile file);
    TreatmentRecordDTO updateTreatmentRecord(Long id, TreatmentRecordDTO dto);
}