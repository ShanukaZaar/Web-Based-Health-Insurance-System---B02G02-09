package com.mlbb2g209.healthinsurance.hospital;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HospitalBillServiceImpl implements HospitalBillService {

    private final HospitalBillRepository hospitalBillRepository;
    private final TreatmentRecordRepository treatmentRecordRepository;
    private final HospitalRepository hospitalRepository;

    public HospitalBillServiceImpl(HospitalBillRepository hospitalBillRepository,
                                    TreatmentRecordRepository treatmentRecordRepository,
                                    HospitalRepository hospitalRepository) {
        this.hospitalBillRepository = hospitalBillRepository;
        this.treatmentRecordRepository = treatmentRecordRepository;
        this.hospitalRepository = hospitalRepository;
    }

    @Override
    public List<HospitalBillDTO> getAllBills() {
        return hospitalBillRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public HospitalBillDTO getBillById(Long id) {
        return toDTO(findOrThrow(id));
    }

    @Override
    public List<HospitalBillDTO> getBillsByHospital(Long hospitalId) {
        return hospitalBillRepository.findByHospitalId(hospitalId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<HospitalBillDTO> getBillsByStatus(String status) {
        HospitalBillStatus billStatus = parseStatus(status);
        return hospitalBillRepository.findByStatus(billStatus).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<HospitalBillDTO> getBillsByTreatmentRecord(Long treatmentRecordId) {
        return hospitalBillRepository.findByTreatmentRecordId(treatmentRecordId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public HospitalBillDTO submitBill(HospitalBillDTO dto) {
        if (!hospitalRepository.existsById(dto.getHospitalId())) {
            throw new HospitalNotFoundException(dto.getHospitalId());
        }
        if (!treatmentRecordRepository.existsById(dto.getTreatmentRecordId())) {
            throw new TreatmentRecordNotFoundException(dto.getTreatmentRecordId());
        }

        HospitalBill bill = new HospitalBill();
        bill.setHospitalId(dto.getHospitalId());
        bill.setTreatmentRecordId(dto.getTreatmentRecordId());
        bill.setBillAmount(dto.getBillAmount());
        bill.setStatus(HospitalBillStatus.SUBMITTED);

        return toDTO(hospitalBillRepository.save(bill));
    }

    @Override
    public HospitalBillDTO markUnderReview(Long id) {
        HospitalBill bill = findOrThrow(id);
        requireReviewable(bill);
        bill.setStatus(HospitalBillStatus.UNDER_REVIEW);
        return toDTO(hospitalBillRepository.save(bill));
    }

    @Override
    public HospitalBillDTO approveBill(Long id) {
        HospitalBill bill = findOrThrow(id);
        requireReviewable(bill);
        bill.setStatus(HospitalBillStatus.APPROVED);
        return toDTO(hospitalBillRepository.save(bill));
    }

    @Override
    public HospitalBillDTO rejectBill(Long id, String rejectionReason) {
        HospitalBill bill = findOrThrow(id);
        requireReviewable(bill);
        bill.setStatus(HospitalBillStatus.REJECTED);
        bill.setRejectionReason(rejectionReason);
        return toDTO(hospitalBillRepository.save(bill));
    }

    private void requireReviewable(HospitalBill bill) {
        // Once approved or rejected, a bill is a permanent financial record --
        // same principle as claims.
        if (bill.getStatus() == HospitalBillStatus.APPROVED || bill.getStatus() == HospitalBillStatus.REJECTED) {
            throw new InvalidHospitalBillStateException(
                    "This bill has already been " + bill.getStatus().name().toLowerCase() + " and cannot be changed.");
        }
    }

    private HospitalBill findOrThrow(Long id) {
        return hospitalBillRepository.findById(id).orElseThrow(() -> new HospitalBillNotFoundException(id));
    }

    private HospitalBillStatus parseStatus(String status) {
        try {
            return HospitalBillStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Unknown bill status: " + status);
        }
    }

    private HospitalBillDTO toDTO(HospitalBill bill) {
        HospitalBillDTO dto = new HospitalBillDTO();
        dto.setId(bill.getId());
        dto.setHospitalId(bill.getHospitalId());
        dto.setTreatmentRecordId(bill.getTreatmentRecordId());
        dto.setBillAmount(bill.getBillAmount());
        dto.setStatus(bill.getStatus() != null ? bill.getStatus().name() : null);
        dto.setRejectionReason(bill.getRejectionReason());
        dto.setCreatedAt(bill.getCreatedAt());
        return dto;
    }
}