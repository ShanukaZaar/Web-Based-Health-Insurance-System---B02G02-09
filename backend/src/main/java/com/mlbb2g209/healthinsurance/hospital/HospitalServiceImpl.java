package com.mlbb2g209.healthinsurance.hospital;

import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class HospitalServiceImpl implements HospitalService {

    private final HospitalRepository hospitalRepository;
    private final TreatmentRecordRepository treatmentRecordRepository;
    private final HospitalBillRepository billRepository;
    private final PolicyLookup policyLookup;

    public HospitalServiceImpl(HospitalRepository hospitalRepository,
                               TreatmentRecordRepository treatmentRecordRepository,
                               HospitalBillRepository billRepository,
                               PolicyLookup policyLookup) {
        this.hospitalRepository = hospitalRepository;
        this.treatmentRecordRepository = treatmentRecordRepository;
        this.billRepository = billRepository;
        this.policyLookup = policyLookup;
    }

    // ------------------------------------------------------------------
    // Eligibility verification
    // ------------------------------------------------------------------

    @Override
    @Transactional(readOnly = true)
    public EligibilityResponseDTO verifyEligibility(Long policyId) {
        if (policyId == null || policyId <= 0) {
            return EligibilityResponseDTO.notEligible(policyId, "Enter a valid policy ID.");
        }
        return policyLookup.checkEligibility(policyId);
    }

    // ------------------------------------------------------------------
    // Hospital CRUD
    // ------------------------------------------------------------------

    @Override
    @Transactional(readOnly = true)
    public List<HospitalDTO> getAllHospitals() {
        return hospitalRepository.findAll().stream().map(this::toDto).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public HospitalDTO getHospitalById(Long id) {
        return toDto(findHospital(id));
    }

    @Override
    public HospitalDTO createHospital(HospitalDTO dto) {
        if (hospitalRepository.existsByRegistrationNo(dto.getRegistrationNo())) {
            throw new IllegalArgumentException(
                    "A hospital with registration number " + dto.getRegistrationNo() + " already exists.");
        }
        Hospital hospital = new Hospital();
        apply(dto, hospital);
        return toDto(hospitalRepository.save(hospital));
    }

    @Override
    public HospitalDTO updateHospital(Long id, HospitalDTO dto) {
        Hospital hospital = findHospital(id);
        hospitalRepository.findByRegistrationNo(dto.getRegistrationNo())
                .filter(other -> !other.getId().equals(id))
                .ifPresent(other -> {
                    throw new IllegalArgumentException(
                            "Registration number " + dto.getRegistrationNo() + " belongs to another hospital.");
                });
        apply(dto, hospital);
        return toDto(hospitalRepository.save(hospital));
    }

    @Override
    public void deleteHospital(Long id) {
        Hospital hospital = findHospital(id);
        boolean hasRecords = !treatmentRecordRepository.findByHospitalIdAndDeletedFalse(id).isEmpty();
        if (hasRecords) {
            throw new IllegalStateException(
                    "This hospital has treatment records. Deactivate it instead of deleting it.");
        }
        hospitalRepository.delete(hospital);
    }

    // ------------------------------------------------------------------
    // Treatment records
    // ------------------------------------------------------------------

    @Override
    @Transactional(readOnly = true)
    public List<TreatmentRecordDTO> getAllTreatmentRecords() {
        return treatmentRecordRepository.findByDeletedFalseOrderByTreatmentDateDesc()
                .stream().map(this::toDto).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public TreatmentRecordDTO getTreatmentRecordById(Long id) {
        return toDto(findTreatment(id));
    }

    @Override
    public TreatmentRecordDTO createTreatmentRecord(TreatmentRecordDTO dto) {
        EligibilityResponseDTO eligibility = policyLookup.checkEligibility(dto.getPolicyId());
        if (!eligibility.isEligible()) {
            throw new IllegalArgumentException(
                    "Cannot record treatment against policy " + dto.getPolicyId() + ". " + eligibility.getMessage());
        }
        TreatmentRecord record = new TreatmentRecord();
        record.setHospital(findHospital(dto.getHospitalId()));
        apply(dto, record);
        return toDto(treatmentRecordRepository.save(record));
    }

    @Override
    public TreatmentRecordDTO updateTreatmentRecord(Long id, TreatmentRecordDTO dto) {
        TreatmentRecord record = findTreatment(id);
        if (dto.getHospitalId() != null && !dto.getHospitalId().equals(record.getHospital().getId())) {
            record.setHospital(findHospital(dto.getHospitalId()));
        }
        apply(dto, record);
        return toDto(treatmentRecordRepository.save(record));
    }

    @Override
    public void withdrawTreatmentRecord(Long id) {
        TreatmentRecord record = findTreatment(id);
        boolean billed = billRepository.findByTreatmentRecordId(id).stream()
                .anyMatch(b -> b.getStatus() != BillStatus.DRAFT);
        if (billed) {
            throw new IllegalStateException(
                    "This record has a submitted bill and can no longer be withdrawn.");
        }
        record.setDeleted(true);
        treatmentRecordRepository.save(record);
    }

    // ------------------------------------------------------------------
    // Hospital bills
    // ------------------------------------------------------------------

    @Override
    @Transactional(readOnly = true)
    public List<HospitalBillDTO> getAllBills() {
        return billRepository.findAllByOrderByBillDateDesc().stream().map(this::toDto).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public HospitalBillDTO getBillById(Long id) {
        return toDto(findBill(id));
    }

    @Override
    public HospitalBillDTO createBill(HospitalBillDTO dto) {
        TreatmentRecord record = findTreatment(dto.getTreatmentRecordId());
        HospitalBill bill = new HospitalBill();
        bill.setTreatmentRecord(record);
        bill.setAmount(dto.getAmount());
        bill.setBillDate(dto.getBillDate());
        bill.setDescription(dto.getDescription());
        bill.setStatus(dto.getStatus() == null ? BillStatus.DRAFT : dto.getStatus());
        return toDto(billRepository.save(bill));
    }

    @Override
    public HospitalBillDTO updateBill(Long id, HospitalBillDTO dto) {
        HospitalBill bill = findBill(id);
        if (bill.getStatus() == BillStatus.APPROVED || bill.getStatus() == BillStatus.PAID) {
            throw new IllegalStateException("An approved or paid bill cannot be edited.");
        }
        if (dto.getTreatmentRecordId() != null
                && !dto.getTreatmentRecordId().equals(bill.getTreatmentRecord().getId())) {
            bill.setTreatmentRecord(findTreatment(dto.getTreatmentRecordId()));
        }
        bill.setAmount(dto.getAmount());
        bill.setBillDate(dto.getBillDate());
        bill.setDescription(dto.getDescription());
        if (dto.getStatus() != null) {
            bill.setStatus(dto.getStatus());
        }
        return toDto(billRepository.save(bill));
    }

    @Override
    public HospitalBillDTO submitBill(Long id) {
        HospitalBill bill = findBill(id);
        if (bill.getStatus() != BillStatus.DRAFT) {
            throw new IllegalStateException("Only a draft bill can be submitted.");
        }
        bill.setStatus(BillStatus.SUBMITTED);
        return toDto(billRepository.save(bill));
    }

    @Override
    public void deleteBill(Long id) {
        HospitalBill bill = findBill(id);
        if (bill.getStatus() != BillStatus.DRAFT) {
            throw new IllegalStateException("Only a draft bill can be deleted.");
        }
        billRepository.delete(bill);
    }

    // ------------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------------

    private Hospital findHospital(Long id) {
        return hospitalRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Hospital " + id + " was not found."));
    }

    private TreatmentRecord findTreatment(Long id) {
        return treatmentRecordRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new EntityNotFoundException("Treatment record " + id + " was not found."));
    }

    private HospitalBill findBill(Long id) {
        return billRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Bill " + id + " was not found."));
    }

    private void apply(HospitalDTO dto, Hospital entity) {
        entity.setName(dto.getName());
        entity.setRegistrationNo(dto.getRegistrationNo());
        entity.setAddress(dto.getAddress());
        entity.setContactNo(dto.getContactNo());
        entity.setEmail(dto.getEmail());
        entity.setActive(dto.isActive());
    }

    private void apply(TreatmentRecordDTO dto, TreatmentRecord entity) {
        entity.setPolicyId(dto.getPolicyId());
        entity.setPatientName(dto.getPatientName());
        entity.setDiagnosis(dto.getDiagnosis());
        entity.setTreatmentDetails(dto.getTreatmentDetails());
        entity.setTreatmentDate(dto.getTreatmentDate());
        entity.setEstimatedCost(dto.getEstimatedCost());
        entity.setReportFileName(dto.getReportFileName());
    }

    private HospitalDTO toDto(Hospital entity) {
        HospitalDTO dto = new HospitalDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setRegistrationNo(entity.getRegistrationNo());
        dto.setAddress(entity.getAddress());
        dto.setContactNo(entity.getContactNo());
        dto.setEmail(entity.getEmail());
        dto.setActive(entity.isActive());
        return dto;
    }

    private TreatmentRecordDTO toDto(TreatmentRecord entity) {
        TreatmentRecordDTO dto = new TreatmentRecordDTO();
        dto.setId(entity.getId());
        dto.setHospitalId(entity.getHospital().getId());
        dto.setHospitalName(entity.getHospital().getName());
        dto.setPolicyId(entity.getPolicyId());
        dto.setPatientName(entity.getPatientName());
        dto.setDiagnosis(entity.getDiagnosis());
        dto.setTreatmentDetails(entity.getTreatmentDetails());
        dto.setTreatmentDate(entity.getTreatmentDate());
        dto.setEstimatedCost(entity.getEstimatedCost());
        dto.setReportFileName(entity.getReportFileName());
        return dto;
    }

    private HospitalBillDTO toDto(HospitalBill entity) {
        HospitalBillDTO dto = new HospitalBillDTO();
        dto.setId(entity.getId());
        dto.setTreatmentRecordId(entity.getTreatmentRecord().getId());
        dto.setPatientName(entity.getTreatmentRecord().getPatientName());
        dto.setHospitalName(entity.getTreatmentRecord().getHospital().getName());
        dto.setAmount(entity.getAmount());
        dto.setBillDate(entity.getBillDate());
        dto.setDescription(entity.getDescription());
        dto.setStatus(entity.getStatus());
        return dto;
    }
}
