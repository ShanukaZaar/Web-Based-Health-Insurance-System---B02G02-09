package com.mlbb2g209.healthinsurance.hospital;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TreatmentRecordRepository extends JpaRepository<TreatmentRecord, Long> {

    List<TreatmentRecord> findByHospitalId(Long hospitalId);

    List<TreatmentRecord> findByUserId(Long userId);

    List<TreatmentRecord> findByPolicyId(Long policyId);
}