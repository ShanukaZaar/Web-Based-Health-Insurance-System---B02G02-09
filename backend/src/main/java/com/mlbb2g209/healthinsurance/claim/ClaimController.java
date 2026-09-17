package com.mlbb2g209.healthinsurance.claim;

import com.mlbb2g209.healthinsurance.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/claims")
public class ClaimController {

    private final ClaimService claimService;

    public ClaimController(ClaimService claimService) {
        this.claimService = claimService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ClaimDTO>>> getAllClaims() {
        List<ClaimDTO> claims = claimService.getAllClaims();
        return ResponseEntity.ok(ApiResponse.success("Claims retrieved successfully", claims));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ClaimDTO>> getClaimById(@PathVariable Long id) {
        ClaimDTO claim = claimService.getClaimById(id);
        return ResponseEntity.ok(ApiResponse.success("Claim retrieved successfully", claim));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<ClaimDTO>>> getClaimsByUser(@PathVariable Long userId) {
        List<ClaimDTO> claims = claimService.getClaimsByUser(userId);
        return ResponseEntity.ok(ApiResponse.success("Claims retrieved successfully", claims));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<ClaimDTO>>> getClaimsByStatus(@PathVariable String status) {
        List<ClaimDTO> claims = claimService.getClaimsByStatus(status);
        return ResponseEntity.ok(ApiResponse.success("Claims retrieved successfully", claims));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ClaimDTO>> submitClaim(@Valid @RequestBody ClaimDTO claimDTO) {
        ClaimDTO created = claimService.submitClaim(claimDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Claim submitted successfully", created));
    }

    @PostMapping(value = "/{id}/document", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<ClaimDTO>> uploadDocument(@PathVariable Long id,
                                                                @RequestParam("file") MultipartFile file) {
        ClaimDTO updated = claimService.uploadDocument(id, file);
        return ResponseEntity.ok(ApiResponse.success("Document uploaded successfully", updated));
    }

    @GetMapping("/{id}/document")
    public ResponseEntity<Resource> downloadDocument(@PathVariable Long id) {
        ClaimDTO claim = claimService.getClaimById(id);

        if (claim.getDocumentPath() == null || claim.getDocumentPath().isBlank()) {
            throw new ClaimNotFoundException(id);
        }

        File file = new File(claim.getDocumentPath());
        if (!file.exists()) {
            throw new ClaimNotFoundException(id);
        }

        Resource resource = new FileSystemResource(file);
        String downloadName = "claim-" + claim.getClaimNumber() + "-document" + getExtension(file.getName());

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + downloadName + "\"")
                .body(resource);
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<ClaimDTO>> approveClaim(@PathVariable Long id,
                                                               @RequestBody ApproveClaimRequest request) {
        ClaimDTO updated = claimService.approveClaim(id, request.getApprovedAmount());
        return ResponseEntity.ok(ApiResponse.success("Claim approved successfully", updated));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<ClaimDTO>> rejectClaim(@PathVariable Long id,
                                                              @RequestBody RejectClaimRequest request) {
        ClaimDTO updated = claimService.rejectClaim(id, request.getRejectionReason());
        return ResponseEntity.ok(ApiResponse.success("Claim rejected successfully", updated));
    }

    @PutMapping("/{id}/withdraw")
    public ResponseEntity<ApiResponse<ClaimDTO>> withdrawClaim(@PathVariable Long id) {
        ClaimDTO updated = claimService.withdrawClaim(id);
        return ResponseEntity.ok(ApiResponse.success("Claim withdrawn successfully", updated));
    }

    @ExceptionHandler(ClaimNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleNotFound(ClaimNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(InvalidClaimStateException.class)
    public ResponseEntity<ApiResponse<Object>> handleInvalidState(InvalidClaimStateException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining("; "));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(message.isEmpty() ? "Validation failed" : message));
    }

    private String getExtension(String filename) {
        int dotIndex = filename.lastIndexOf('.');
        return dotIndex >= 0 ? filename.substring(dotIndex) : "";
    }
}