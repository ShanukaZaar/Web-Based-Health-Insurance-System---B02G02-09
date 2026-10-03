package com.mlbb2g209.healthinsurance.hospital;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HospitalBillRepository extends JpaRepository<HospitalBill, Long> {

    List<HospitalBill> findByHospitalId(Long hospitalId);

    List<HospitalBill> findByStatus(HospitalBillStatus status);

    List<HospitalBill> findByTreatmentRecordId(Long treatmentRecordId);
}