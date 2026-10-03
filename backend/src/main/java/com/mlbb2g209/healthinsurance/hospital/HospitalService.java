package com.mlbb2g209.healthinsurance.hospital;
import java.util.List;
public interface HospitalService {
    HospitalDTO registerHospital(HospitalDTO dto);
    HospitalDTO getHospitalById(Long id);
    List<HospitalDTO> getAllHospitals();
    HospitalDTO updateHospital(Long id, HospitalDTO dto);
    void deleteHospital(Long id);
}
