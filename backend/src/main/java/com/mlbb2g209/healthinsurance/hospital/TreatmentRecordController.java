package com.mlbb2g209.healthinsurance.hospital;

import com.mlbb2g209.healthinsurance.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;

@RestController
@RequestMapping("/api/treatment-records")
public class TreatmentRecordController {

    private final TreatmentRecordService treatmentRecordService;

    public TreatmentRecordController(TreatmentRecordService treatmentRecordService) {
        this.treatmentRecordService = treatmentRecordService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TreatmentRecordDTO>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success("Treatment records retrieved successfully", treatmentRecordService.getAllTreatmentRecords()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TreatmentRecordDTO>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Treatment record retrieved successfully", treatmentRecordService.getTreatmentRecordById(id)));
    }

    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<ApiResponse<List<TreatmentRecordDTO>>> getByHospital(@PathVariable Long hospitalId) {
        return ResponseEntity.ok(ApiResponse.success("Treatment records retrieved successfully", treatmentRecordService.getByHospital(hospitalId)));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<TreatmentRecordDTO>>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success("Treatment records retrieved successfully", treatmentRecordService.getByUser(userId)));
    }

    @GetMapping("/policy/{policyId}")
    public ResponseEntity<ApiResponse<List<TreatmentRecordDTO>>> getByPolicy(@PathVariable Long policyId) {
        return ResponseEntity.ok(ApiResponse.success("Treatment records retrieved successfully", treatmentRecordService.getByPolicy(policyId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TreatmentRecordDTO>> create(@Valid @RequestBody TreatmentRecordDTO dto) {
        TreatmentRecordDTO created = treatmentRecordService.createTreatmentRecord(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Treatment record created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TreatmentRecordDTO>> update(@PathVariable Long id, @Valid @RequestBody TreatmentRecordDTO dto) {
        return ResponseEntity.ok(ApiResponse.success("Treatment record updated successfully", treatmentRecordService.updateTreatmentRecord(id, dto)));
    }

    @PostMapping(value = "/{id}/document", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<TreatmentRecordDTO>> uploadDocument(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(ApiResponse.success("Document uploaded successfully", treatmentRecordService.uploadDocument(id, file)));
    }

    @GetMapping("/{id}/document")
    public ResponseEntity<Resource> downloadDocument(@PathVariable Long id) {
        TreatmentRecordDTO record = treatmentRecordService.getTreatmentRecordById(id);

        if (record.getDocumentPath() == null || record.getDocumentPath().isBlank()) {
            throw new TreatmentRecordNotFoundException(id);
        }

        File file = new File(record.getDocumentPath());
        if (!file.exists()) {
            throw new TreatmentRecordNotFoundException(id);
        }

        Resource resource = new FileSystemResource(file);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"treatment-" + id + "-document\"")
                .body(resource);
    }

    @ExceptionHandler(TreatmentRecordNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleNotFound(TreatmentRecordNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(HospitalNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleHospitalNotFound(HospitalNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ApiResponse<Object>> handleIllegalState(IllegalStateException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Object>> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error(ex.getMessage()));
    }
}