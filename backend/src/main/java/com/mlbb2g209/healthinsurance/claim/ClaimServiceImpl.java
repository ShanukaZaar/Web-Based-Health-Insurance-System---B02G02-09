package com.mlbb2g209.healthinsurance.claim;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ClaimServiceImpl implements ClaimService {

    // Files are stored on disk relative to where the backend process runs.
    // Add "uploads/" to .gitignore -- this is runtime-generated content,
    // not something that belongs in version control.
    private static final String UPLOAD_DIR = "uploads/claims/";

    private final ClaimRepository claimRepository;

    public ClaimServiceImpl(ClaimRepository claimRepository) {
        this.claimRepository = claimRepository;
    }

    @Override
    public List<ClaimDTO> getAllClaims() {
        return claimRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ClaimDTO getClaimById(Long id) {
        return toDTO(findClaimOrThrow(id));
    }

    @Override
    public List<ClaimDTO> getClaimsByUser(Long userId) {
        return claimRepository.findByUserId(userId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ClaimDTO> getClaimsByStatus(String status) {
        ClaimStatus claimStatus = parseStatus(status);
        return claimRepository.findByStatus(claimStatus).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ClaimDTO submitClaim(ClaimDTO claimDTO) {
        Claim claim = new Claim();
        claim.setClaimNumber(generateClaimNumber());
        claim.setUserId(claimDTO.getUserId());
        claim.setPolicyId(claimDTO.getPolicyId());
        claim.setClaimAmount(claimDTO.getClaimAmount());
        claim.setDescription(claimDTO.getDescription());
        claim.setStatus(ClaimStatus.PENDING);

        Claim saved = claimRepository.save(claim);
        return toDTO(saved);
    }

    @Override
    public ClaimDTO uploadDocument(Long id, MultipartFile file) {
        Claim claim = findClaimOrThrow(id);

        if (claim.getStatus() != ClaimStatus.PENDING) {
            throw new InvalidClaimStateException(
                    "Documents can only be added to claims that are still pending review.");
        }
        if (file == null || file.isEmpty()) {
            throw new InvalidClaimStateException("No file was provided.");
        }

        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFilename = file.getOriginalFilename() != null
                    ? file.getOriginalFilename() : "document";
            String extension = "";
            int dotIndex = originalFilename.lastIndexOf('.');
            if (dotIndex >= 0) {
                extension = originalFilename.substring(dotIndex);
            }
            String storedFilename = UUID.randomUUID() + extension;

            Path targetPath = uploadPath.resolve(storedFilename);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            claim.setDocumentPath(UPLOAD_DIR + storedFilename);
            return toDTO(claimRepository.save(claim));
        } catch (IOException e) {
            throw new RuntimeException("Failed to store claim document: " + e.getMessage(), e);
        }
    }

    @Override
    public ClaimDTO approveClaim(Long id, BigDecimal approvedAmount) {
        Claim claim = findClaimOrThrow(id);
        requirePendingStatus(claim);

        claim.setStatus(ClaimStatus.APPROVED);
        claim.setApprovedAmount(approvedAmount);
        claim.setReviewedAt(LocalDateTime.now());

        return toDTO(claimRepository.save(claim));
    }

    @Override
    public ClaimDTO rejectClaim(Long id, String rejectionReason) {
        Claim claim = findClaimOrThrow(id);
        requirePendingStatus(claim);

        claim.setStatus(ClaimStatus.REJECTED);
        claim.setRejectionReason(rejectionReason);
        claim.setReviewedAt(LocalDateTime.now());

        return toDTO(claimRepository.save(claim));
    }

    @Override
    public ClaimDTO withdrawClaim(Long id) {
        Claim claim = findClaimOrThrow(id);
        requirePendingStatus(claim);

        claim.setStatus(ClaimStatus.WITHDRAWN);
        claim.setReviewedAt(LocalDateTime.now());

        return toDTO(claimRepository.save(claim));
    }

    // ---------- helpers ----------

    private void requirePendingStatus(Claim claim) {
        if (claim.getStatus() != ClaimStatus.PENDING) {
            throw new InvalidClaimStateException(
                    "This action is only allowed while a claim is PENDING. Current status: "
                            + claim.getStatus());
        }
    }

    private Claim findClaimOrThrow(Long id) {
        return claimRepository.findById(id)
                .orElseThrow(() -> new ClaimNotFoundException(id));
    }

    private String generateClaimNumber() {
        String candidate;
        do {
            candidate = "CLM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (claimRepository.findByClaimNumber(candidate).isPresent());
        return candidate;
    }

    private ClaimStatus parseStatus(String status) {
        try {
            return ClaimStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new InvalidClaimStateException("Unknown claim status: " + status);
        }
    }

    private ClaimDTO toDTO(Claim claim) {
        ClaimDTO dto = new ClaimDTO();
        dto.setId(claim.getId());
        dto.setClaimNumber(claim.getClaimNumber());
        dto.setUserId(claim.getUserId());
        dto.setPolicyId(claim.getPolicyId());
        dto.setClaimAmount(claim.getClaimAmount());
        dto.setApprovedAmount(claim.getApprovedAmount());
        dto.setStatus(claim.getStatus() != null ? claim.getStatus().name() : null);
        dto.setDescription(claim.getDescription());
        dto.setDocumentPath(claim.getDocumentPath());
        dto.setRejectionReason(claim.getRejectionReason());
        dto.setReviewedAt(claim.getReviewedAt());
        dto.setCreatedAt(claim.getCreatedAt());
        return dto;
    }
}