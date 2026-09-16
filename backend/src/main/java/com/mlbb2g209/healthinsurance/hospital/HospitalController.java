package com.mlbb2g209.healthinsurance.hospital;

import com.mlbb2g209.healthinsurance.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospitals")
public class HospitalController {

    private final HospitalService hospitalService;

    public HospitalController(HospitalService hospitalService) {
        this.hospitalService = hospitalService;
    }

    @GetMapping
    public ResponseEntity<List<HospitalDTO>> getAllHospitals() {
        return ResponseEntity.ok(hospitalService.getAllHospitals());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HospitalDTO> getHospital(@PathVariable Long id) {
        return ResponseEntity.ok(hospitalService.getHospitalById(id));
    }

    @PostMapping
    public ResponseEntity<HospitalDTO> createHospital(@Valid @RequestBody HospitalDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(hospitalService.createHospital(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HospitalDTO> updateHospital(@PathVariable Long id,
                                                      @Valid @RequestBody HospitalDTO dto) {
        return ResponseEntity.ok(hospitalService.updateHospital(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHospital(@PathVariable Long id) {
        hospitalService.deleteHospital(id);
        return ResponseEntity.noContent().build();
    }

    // --- Treatment records --------------------------------------------

    @GetMapping("/treatments")
    public ResponseEntity<List<TreatmentRecordDTO>> getAllTreatments() {
        return ResponseEntity.ok(hospitalService.getAllTreatmentRecords());
    }

    @GetMapping("/treatments/{id}")
    public ResponseEntity<TreatmentRecordDTO> getTreatment(@PathVariable Long id) {
        return ResponseEntity.ok(hospitalService.getTreatmentRecordById(id));
    }

    @PostMapping("/treatments")
    public ResponseEntity<TreatmentRecordDTO> createTreatment(@Valid @RequestBody TreatmentRecordDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(hospitalService.createTreatmentRecord(dto));
    }

    @PutMapping("/treatments/{id}")
    public ResponseEntity<TreatmentRecordDTO> updateTreatment(@PathVariable Long id,
                                                              @Valid @RequestBody TreatmentRecordDTO dto) {
        return ResponseEntity.ok(hospitalService.updateTreatmentRecord(id, dto));
    }

    /** Soft delete: the record is withdrawn, not erased. */
    @DeleteMapping("/treatments/{id}")
    public ResponseEntity<Void> withdrawTreatment(@PathVariable Long id) {
        hospitalService.withdrawTreatmentRecord(id);
        return ResponseEntity.noContent().build();
    }

    // --- Hospital bills ------------------------------------------------

    @GetMapping("/bills")
    public ResponseEntity<List<HospitalBillDTO>> getAllBills() {
        return ResponseEntity.ok(hospitalService.getAllBills());
    }

    @GetMapping("/bills/{id}")
    public ResponseEntity<HospitalBillDTO> getBill(@PathVariable Long id) {
        return ResponseEntity.ok(hospitalService.getBillById(id));
    }

    @PostMapping("/bills")
    public ResponseEntity<HospitalBillDTO> createBill(@Valid @RequestBody HospitalBillDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(hospitalService.createBill(dto));
    }

    @PutMapping("/bills/{id}")
    public ResponseEntity<HospitalBillDTO> updateBill(@PathVariable Long id,
                                                      @Valid @RequestBody HospitalBillDTO dto) {
        return ResponseEntity.ok(hospitalService.updateBill(id, dto));
    }

    @PatchMapping("/bills/{id}/submit")
    public ResponseEntity<HospitalBillDTO> submitBill(@PathVariable Long id) {
        return ResponseEntity.ok(hospitalService.submitBill(id));
    }

    @DeleteMapping("/bills/{id}")
    public ResponseEntity<Void> deleteBill(@PathVariable Long id) {
        hospitalService.deleteBill(id);
        return ResponseEntity.noContent().build();
    }
