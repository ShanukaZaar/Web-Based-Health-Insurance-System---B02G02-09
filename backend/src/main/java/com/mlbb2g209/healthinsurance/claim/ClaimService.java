package com.mlbb2g209.healthinsurance.claim;

import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

public interface ClaimService {

    List<ClaimDTO> getAllClaims();

    ClaimDTO getClaimById(Long id);

    List<ClaimDTO> getClaimsByUser(Long userId);

    List<ClaimDTO> getClaimsByStatus(String status);

    ClaimDTO submitClaim(ClaimDTO claimDTO);

    ClaimDTO uploadDocument(Long id, MultipartFile file);

    ClaimDTO approveClaim(Long id, BigDecimal approvedAmount);

    ClaimDTO rejectClaim(Long id, String rejectionReason);

    /**
     * Soft-deletes a claim by marking it WITHDRAWN. Only allowed while the
     * claim is still PENDING — approved/rejected claims are permanent,
     * read-only records and cannot be withdrawn.
     */
    ClaimDTO withdrawClaim(Long id);
}