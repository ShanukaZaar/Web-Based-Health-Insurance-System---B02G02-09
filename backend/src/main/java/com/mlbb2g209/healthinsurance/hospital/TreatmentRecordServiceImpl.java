package com.mlbb2g209.healthinsurance.hospital;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TreatmentRecordServiceImpl implements TreatmentRecordService {

    // Reuses the same uploads/ convention as the Claim module; already
    // covered by .gitignore.
    private static final String UPLOAD_DIR = "uploads/treatment-records/";

    private final TreatmentRecordRepository treatmentRecordRepository;
    private final HospitalRepository hospitalRepository;

    public TreatmentRecordServiceImpl(TreatmentRecordRepository treatmentRecordRepository,
                                       HospitalRepository hospitalRepository) {
        this.treatmentRecordRepository = treatmentRecordRepository;
        this.hospitalRepository = hospitalRepository;
    }

    @Override
    public List<TreatmentRecordDTO> getAllTreatmentRecords() {
        return treatmentRecordRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public TreatmentRecordDTO getTreatmentRecordById(Long id) {
        return toDTO(findOrThrow(id));
    }

    @Override
    public List<TreatmentRecordDTO> getByHospital(Long hospitalId) {
        return treatmentRecordRepository.findByHospitalId(hospitalId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<TreatmentRecordDTO> getByUser(Long userId) {
        return treatmentRecordRepository.findByUserId(userId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<TreatmentRecordDTO> getByPolicy(Long policyId) {
        return treatmentRecordRepository.findByPolicyId(policyId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public TreatmentRecordDTO createTreatmentRecord(TreatmentRecordDTO dto) {
        // Confirm the hospital exists and is actually allowed to submit records.
        Hospital hospital = hospitalRepository.findById(dto.getHospitalId())
                .orElseThrow(() -> new HospitalNotFoundException(dto.getHospitalId()));

        if (hospital.getStatus() != HospitalStatus.ACTIVE) {
            throw new IllegalStateException("Hospital " + hospital.getHospitalCode() + " is not active and cannot submit records.");
        }

        TreatmentRecord record = new TreatmentRecord();
        record.setHospitalId(dto.getHospitalId());
        record.setUserId(dto.getUserId());
        record.setPolicyId(dto.getPolicyId());
        record.setDiagnosis(dto.getDiagnosis());
        record.setTreatmentNotes(dto.getTreatmentNotes());

        return toDTO(treatmentRecordRepository.save(record));
    }

    @Override
    public TreatmentRecordDTO uploadDocument(Long id, MultipartFile file) {
        TreatmentRecord record = findOrThrow(id);

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("No file was provided.");
        }

        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "document";
            String extension = "";
            int dotIndex = originalFilename.lastIndexOf('.');
            if (dotIndex >= 0) extension = originalFilename.substring(dotIndex);

            String storedFilename = UUID.randomUUID() + extension;
            Path targetPath = uploadPath.resolve(storedFilename);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            record.setDocumentPath(UPLOAD_DIR + storedFilename);
            return toDTO(treatmentRecordRepository.save(record));
        } catch (IOException e) {
            throw new RuntimeException("Failed to store treatment document: " + e.getMessage(), e);
        }
    }

    @Override
    public TreatmentRecordDTO updateTreatmentRecord(Long id, TreatmentRecordDTO dto) {
        TreatmentRecord record = findOrThrow(id);
        record.setDiagnosis(dto.getDiagnosis());
        record.setTreatmentNotes(dto.getTreatmentNotes());
        return toDTO(treatmentRecordRepository.save(record));
    }

    private TreatmentRecord findOrThrow(Long id) {
        return treatmentRecordRepository.findById(id).orElseThrow(() -> new TreatmentRecordNotFoundException(id));
    }

    private TreatmentRecordDTO toDTO(TreatmentRecord record) {
        TreatmentRecordDTO dto = new TreatmentRecordDTO();
        dto.setId(record.getId());
        dto.setHospitalId(record.getHospitalId());
        dto.setUserId(record.getUserId());
        dto.setPolicyId(record.getPolicyId());
        dto.setDiagnosis(record.getDiagnosis());
        dto.setTreatmentNotes(record.getTreatmentNotes());
        dto.setDocumentPath(record.getDocumentPath());
        dto.setCreatedAt(record.getCreatedAt());
        return dto;
    }
}