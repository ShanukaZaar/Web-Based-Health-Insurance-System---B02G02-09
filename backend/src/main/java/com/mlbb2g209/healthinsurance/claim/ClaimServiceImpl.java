package com.mlbb2g209.healthinsurance.claim;

import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class ClaimServiceImpl implements ClaimService {

    private final ClaimRepository claimRepository;

    public ClaimServiceImpl(ClaimRepository claimRepository) {
        this.claimRepository = claimRepository;
    }

    @Override
    public List<ClaimDTO> getAllClaims() {
        return Collections.emptyList();
    }

    @Override
    public ClaimDTO getClaimById(Long id) {
        return null;
    }

    @Override
    public ClaimDTO submitClaim(ClaimDTO claimDTO) {
        return claimDTO;
    }
}
