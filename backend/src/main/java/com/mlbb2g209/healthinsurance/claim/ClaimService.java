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

    /**
     * Rejects a PENDING claim and moves it from claims to deleted_claims
     * (archived in one transaction, then removed from claims).
     */
    ClaimDTO rejectClaim(Long id, String rejectionReason);

    ClaimDTO withdrawClaim(Long id);

    List<DeletedClaimDTO> getAllDeletedClaims();

    DeletedClaimDTO getDeletedClaimById(Long id);

    List<DeletedClaimDTO> getDeletedClaimsByUser(Long userId);
}