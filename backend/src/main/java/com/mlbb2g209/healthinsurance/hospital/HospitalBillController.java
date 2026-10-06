package com.mlbb2g209.healthinsurance.hospital;

import com.mlbb2g209.healthinsurance.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hospital-bills")
public class HospitalBillController {

    private final HospitalBillService hospitalBillService;

    public HospitalBillController(HospitalBillService hospitalBillService) {
        this.hospitalBillService = hospitalBillService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<HospitalBillDTO>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success("Bills retrieved successfully", hospitalBillService.getAllBills()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<HospitalBillDTO>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Bill retrieved successfully", hospitalBillService.getBillById(id)));
    }

    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<ApiResponse<List<HospitalBillDTO>>> getByHospital(@PathVariable Long hospitalId) {
        return ResponseEntity.ok(ApiResponse.success("Bills retrieved successfully", hospitalBillService.getBillsByHospital(hospitalId)));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<HospitalBillDTO>>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(ApiResponse.success("Bills retrieved successfully", hospitalBillService.getBillsByStatus(status)));
    }

    @GetMapping("/treatment-record/{treatmentRecordId}")
    public ResponseEntity<ApiResponse<List<HospitalBillDTO>>> getByTreatmentRecord(@PathVariable Long treatmentRecordId) {
        return ResponseEntity.ok(ApiResponse.success("Bills retrieved successfully", hospitalBillService.getBillsByTreatmentRecord(treatmentRecordId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<HospitalBillDTO>> submitBill(@Valid @RequestBody HospitalBillDTO dto) {
        HospitalBillDTO created = hospitalBillService.submitBill(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Bill submitted successfully", created));
    }

    @PutMapping("/{id}/review")
    public ResponseEntity<ApiResponse<HospitalBillDTO>> markUnderReview(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Bill marked under review", hospitalBillService.markUnderReview(id)));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<HospitalBillDTO>> approve(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Bill approved successfully", hospitalBillService.approveBill(id)));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<HospitalBillDTO>> reject(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String reason = body.get("rejectionReason");
        return ResponseEntity.ok(ApiResponse.success("Bill rejected successfully", hospitalBillService.rejectBill(id, reason)));
    }

    @ExceptionHandler(HospitalBillNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleNotFound(HospitalBillNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(HospitalNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleHospitalNotFound(HospitalNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(TreatmentRecordNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleTreatmentNotFound(TreatmentRecordNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(InvalidHospitalBillStateException.class)
    public ResponseEntity<ApiResponse<Object>> handleInvalidState(InvalidHospitalBillStateException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error(ex.getMessage()));
    }
}