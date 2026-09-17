package com.mlbb2g209.healthinsurance.claim;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClaimServiceImpl implements ClaimService {

    private final ClaimRepository claimRepository;

    public ClaimServiceImpl(ClaimRepository claimRepository) {
        this.claimRepository = claimRepository;
    }

    @Override
    public List<ClaimDTO> getAllClaims() {
        return claimRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ClaimDTO getClaimById(Long id) {
        Claim claim = claimRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Claim not found with id: " + id));
        return toDTO(claim);
    }

    @Override
    public ClaimDTO submitClaim(ClaimDTO claimDTO) {
        Claim claim = new Claim();
        claim.setClaimNumber(
                claimDTO.getClaimNumber() != null ? claimDTO.getClaimNumber() : generateClaimNumber());
        claim.setUserId(claimDTO.getUserId());
        claim.setPolicyId(claimDTO.getPolicyId());
        claim.setClaimAmount(claimDTO.getClaimAmount());
        claim.setApprovedAmount(null);
        claim.setStatus("PENDING");
        claim.setDescription(claimDTO.getDescription());

        Claim saved = claimRepository.save(claim);
        return toDTO(saved);
    }

    @Override
    public ClaimDTO withdrawClaim(Long id) {
        Claim claim = claimRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Claim not found with id: " + id));

        if (!"PENDING".equals(claim.getStatus())) {
            throw new IllegalStateException(
                    "Claim cannot be withdrawn once it has been reviewed. Current status: " + claim.getStatus());
        }

        claim.setStatus("WITHDRAWN");
        Claim saved = claimRepository.save(claim);
        return toDTO(saved);
    }

    private String generateClaimNumber() {
        return "CLM-" + System.currentTimeMillis();
    }

    private ClaimDTO toDTO(Claim claim) {
        return new ClaimDTO(
                claim.getId(),
                claim.getClaimNumber(),
                claim.getUserId(),
                claim.getPolicyId(),
                claim.getClaimAmount(),
                claim.getApprovedAmount(),
                claim.getStatus(),
                claim.getDescription()
        );
    }
}