package com.mlbb2g209.healthinsurance.claim;

import java.util.List;

public interface ClaimService {
    List<ClaimDTO> getAllClaims();
    ClaimDTO getClaimById(Long id);
    ClaimDTO submitClaim(ClaimDTO claimDTO);
    ClaimDTO withdrawClaim(Long id);
}
