package com.mlbb2g209.healthinsurance.hospital;

import java.util.List;

public interface HospitalService {
    List<HospitalDTO> getAllHospitals();
    HospitalDTO getHospitalById(Long id);
    HospitalDTO registerHospital(HospitalDTO hospitalDTO);
}
