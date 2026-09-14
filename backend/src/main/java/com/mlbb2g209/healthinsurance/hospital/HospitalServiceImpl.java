package com.mlbb2g209.healthinsurance.hospital;

import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class HospitalServiceImpl implements HospitalService {

    private final HospitalRepository hospitalRepository;

    public HospitalServiceImpl(HospitalRepository hospitalRepository) {
        this.hospitalRepository = hospitalRepository;
    }

    @Override
    public List<HospitalDTO> getAllHospitals() {
        return Collections.emptyList();
    }

    @Override
    public HospitalDTO getHospitalById(Long id) {
        return null;
    }

    @Override
    public HospitalDTO registerHospital(HospitalDTO hospitalDTO) {
        return hospitalDTO;
    }
}
