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
    public ResponseEntity<ApiResponse<List<HospitalDTO>>> getAllHospitals() {
        List<HospitalDTO> hospitals = hospitalService.getAllHospitals();
        return ResponseEntity.ok(ApiResponse.success("Hospitals retrieved successfully", hospitals));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<HospitalDTO>> getHospitalById(@PathVariable Long id) {
        HospitalDTO hospital = hospitalService.getHospitalById(id);
        return ResponseEntity.ok(ApiResponse.success("Hospital retrieved successfully", hospital));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<HospitalDTO>> registerHospital(@RequestBody HospitalDTO hospitalDTO) {
        HospitalDTO registered = hospitalService.registerHospital(hospitalDTO);
        return ResponseEntity.ok(ApiResponse.success("Hospital registered successfully", registered));
    }
}
