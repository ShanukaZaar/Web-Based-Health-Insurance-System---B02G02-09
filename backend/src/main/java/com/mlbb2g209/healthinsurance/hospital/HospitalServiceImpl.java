package com.mlbb2g209.healthinsurance.hospital;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class HospitalServiceImpl implements HospitalService {

    private final HospitalRepository hospitalRepository;

    public HospitalServiceImpl(HospitalRepository hospitalRepository) {
        this.hospitalRepository = hospitalRepository;
    }

    @Override
    public List<HospitalDTO> getAllHospitals() {
        return hospitalRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public HospitalDTO getHospitalById(Long id) {
        return toDTO(findOrThrow(id));
    }

    @Override
    public List<HospitalDTO> getHospitalsByStatus(String status) {
        HospitalStatus hospitalStatus = parseStatus(status);
        return hospitalRepository.findByStatus(hospitalStatus).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<HospitalDTO> getHospitalsByCity(String city) {
        return hospitalRepository.findByCityIgnoreCase(city).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public HospitalDTO registerHospital(HospitalDTO dto) {
        Hospital hospital = new Hospital();
        hospital.setHospitalCode(generateHospitalCode());
        hospital.setName(dto.getName());
        hospital.setAddress(dto.getAddress());
        hospital.setCity(dto.getCity());
        hospital.setContactNumber(dto.getContactNumber());
        hospital.setEmail(dto.getEmail());
        hospital.setStatus(HospitalStatus.ACTIVE);

        return toDTO(hospitalRepository.save(hospital));
    }

    @Override
    public HospitalDTO updateHospital(Long id, HospitalDTO dto) {
        Hospital hospital = findOrThrow(id);
        hospital.setName(dto.getName());
        hospital.setAddress(dto.getAddress());
        hospital.setCity(dto.getCity());
        hospital.setContactNumber(dto.getContactNumber());
        hospital.setEmail(dto.getEmail());
        if (dto.getStatus() != null && !dto.getStatus().isBlank()) {
            hospital.setStatus(parseStatus(dto.getStatus()));
        }

        return toDTO(hospitalRepository.save(hospital));
    }

    @Override
    public HospitalDTO suspendHospital(Long id) {
        Hospital hospital = findOrThrow(id);
        hospital.setStatus(HospitalStatus.SUSPENDED);
        return toDTO(hospitalRepository.save(hospital));
    }

    @Override
    public HospitalDTO reactivateHospital(Long id) {
        Hospital hospital = findOrThrow(id);
        hospital.setStatus(HospitalStatus.ACTIVE);
        return toDTO(hospitalRepository.save(hospital));
    }

    @Override
    public HospitalDTO deactivateHospital(Long id) {
        // Soft-delete equivalent -- hospitals are never hard-deleted since
        // treatment records and bills reference them permanently.
        Hospital hospital = findOrThrow(id);
        hospital.setStatus(HospitalStatus.INACTIVE);
        return toDTO(hospitalRepository.save(hospital));
    }

    @Override
    public void deleteHospital(Long id) {
        Hospital hospital = findOrThrow(id);
        hospitalRepository.delete(hospital);
    }

    private Hospital findOrThrow(Long id) {
        return hospitalRepository.findById(id).orElseThrow(() -> new HospitalNotFoundException(id));
    }

    private String generateHospitalCode() {
        String candidate;
        do {
            candidate = "HSP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (hospitalRepository.findByHospitalCode(candidate).isPresent());
        return candidate;
    }

    private HospitalStatus parseStatus(String status) {
        try {
            return HospitalStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Unknown hospital status: " + status);
        }
    }

    private HospitalDTO toDTO(Hospital hospital) {
        HospitalDTO dto = new HospitalDTO();
        dto.setId(hospital.getId());
        dto.setHospitalCode(hospital.getHospitalCode());
        dto.setName(hospital.getName());
        dto.setAddress(hospital.getAddress());
        dto.setCity(hospital.getCity());
        dto.setContactNumber(hospital.getContactNumber());
        dto.setEmail(hospital.getEmail());
        dto.setStatus(hospital.getStatus() != null ? hospital.getStatus().name() : null);
        return dto;
    }
}