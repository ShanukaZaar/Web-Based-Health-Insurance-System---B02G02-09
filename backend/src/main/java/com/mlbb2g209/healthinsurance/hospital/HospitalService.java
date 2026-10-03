package com.mlbb2g209.healthinsurance.hospital;

import java.util.List;

public interface HospitalService {
    List<HospitalDTO> getAllHospitals();
    HospitalDTO getHospitalById(Long id);
    List<HospitalDTO> getHospitalsByStatus(String status);
    List<HospitalDTO> getHospitalsByCity(String city);
    HospitalDTO registerHospital(HospitalDTO dto);
    HospitalDTO updateHospital(Long id, HospitalDTO dto);
    HospitalDTO suspendHospital(Long id);
    HospitalDTO reactivateHospital(Long id);
    HospitalDTO deactivateHospital(Long id);
}