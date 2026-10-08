package com.mlbb2g209.healthinsurance.hospital;

import com.mlbb2g209.healthinsurance.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospitals")
public class HospitalController {

    private final HospitalService hospitalService;
    private final EligibilityService eligibilityService;

    public HospitalController(HospitalService hospitalService, EligibilityService eligibilityService) {
        this.hospitalService = hospitalService;
        this.eligibilityService = eligibilityService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<HospitalDTO>>> getAllHospitals() {
        return ResponseEntity.ok(ApiResponse.success("Hospitals retrieved successfully", hospitalService.getAllHospitals()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<HospitalDTO>> getHospitalById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Hospital retrieved successfully", hospitalService.getHospitalById(id)));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<HospitalDTO>>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(ApiResponse.success("Hospitals retrieved successfully", hospitalService.getHospitalsByStatus(status)));
    }

    @GetMapping("/city/{city}")
    public ResponseEntity<ApiResponse<List<HospitalDTO>>> getByCity(@PathVariable String city) {
        return ResponseEntity.ok(ApiResponse.success("Hospitals retrieved successfully", hospitalService.getHospitalsByCity(city)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<HospitalDTO>> registerHospital(@Valid @RequestBody HospitalDTO dto) {
        HospitalDTO created = hospitalService.registerHospital(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Hospital registered successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<HospitalDTO>> updateHospital(@PathVariable Long id, @Valid @RequestBody HospitalDTO dto) {
        return ResponseEntity.ok(ApiResponse.success("Hospital updated successfully", hospitalService.updateHospital(id, dto)));
    }

    @PutMapping("/{id}/suspend")
    public ResponseEntity<ApiResponse<HospitalDTO>> suspendHospital(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Hospital suspended", hospitalService.suspendHospital(id)));
    }

    @PutMapping("/{id}/reactivate")
    public ResponseEntity<ApiResponse<HospitalDTO>> reactivateHospital(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Hospital reactivated", hospitalService.reactivateHospital(id)));
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<ApiResponse<HospitalDTO>> deactivateHospital(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Hospital deactivated", hospitalService.deactivateHospital(id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteHospital(@PathVariable Long id) {
        hospitalService.deleteHospital(id);
        return ResponseEntity.ok(ApiResponse.success("Hospital deleted successfully", null));
    }

    @GetMapping("/eligibility/{policyId}")
    public ResponseEntity<ApiResponse<EligibilityCheck>> checkEligibility(@PathVariable Long policyId) {
        return ResponseEntity.ok(ApiResponse.success("Eligibility check complete", eligibilityService.checkEligibility(policyId)));
    }

    @ExceptionHandler(HospitalNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleNotFound(HospitalNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ApiResponse<Object>> handleIllegalState(IllegalStateException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error(ex.getMessage()));
    }
}