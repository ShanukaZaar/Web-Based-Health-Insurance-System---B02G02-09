package com.mlbb2g209.healthinsurance.claim;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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

    private static final String UPLOAD_DIR = "uploads/claims/";

    private final ClaimRepository claimRepository;
    private final DeletedClaimRepository deletedClaimRepository;

    public ClaimServiceImpl(ClaimRepository claimRepository,
                            DeletedClaimRepository deletedClaimRepository) {
        this.claimRepository = claimRepository;
        this.deletedClaimRepository = deletedClaimRepository;
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

        return toDTO(claimRepository.save(claim));
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
    @Transactional
    public ClaimDTO rejectClaim(Long id, String rejectionReason) {
        Claim claim = findClaimOrThrow(id);
        requirePendingStatus(claim);

        if (rejectionReason == null || rejectionReason.isBlank()) {
            throw new InvalidClaimStateException("A rejection reason is required.");
        }

        claim.setStatus(ClaimStatus.REJECTED);
        claim.setRejectionReason(rejectionReason.trim());
        claim.setReviewedAt(LocalDateTime.now());

        // 1) copy the full record into deleted_claims
        deletedClaimRepository.save(toDeletedClaim(claim));

        // 2) remove it from claims. Both steps run in one transaction, so if
        //    either fails, both are rolled back and no data is lost.
        claimRepository.delete(claim);

        // The uploaded document stays on disk; deleted_claims keeps its path.
        return toDTO(claim);
    }

    @Override
    public ClaimDTO withdrawClaim(Long id) {
        Claim claim = findClaimOrThrow(id);
        requirePendingStatus(claim);

        claim.setStatus(ClaimStatus.WITHDRAWN);
        claim.setReviewedAt(LocalDateTime.now());

        return toDTO(claimRepository.save(claim));
    }

    @Override
    public List<DeletedClaimDTO> getAllDeletedClaims() {
        return deletedClaimRepository.findAll().stream()
                .map(this::toDeletedDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DeletedClaimDTO getDeletedClaimById(Long id) {
        DeletedClaim deleted = deletedClaimRepository.findById(id)
                .orElseThrow(() -> new ClaimNotFoundException(id));
        return toDeletedDTO(deleted);
    }

    @Override
    public List<DeletedClaimDTO> getDeletedClaimsByUser(Long userId) {
        return deletedClaimRepository.findByUserId(userId).stream()
                .map(this::toDeletedDTO)
                .collect(Collectors.toList());
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
        } while (claimRepository.findByClaimNumber(candidate).isPresent()
                || deletedClaimRepository.findByClaimNumber(candidate).isPresent());
        return candidate;
    }

    private ClaimStatus parseStatus(String status) {
        try {
            return ClaimStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new InvalidClaimStateException("Unknown claim status: " + status);
        }
    }

    private DeletedClaim toDeletedClaim(Claim claim) {
        DeletedClaim deleted = new DeletedClaim();
        deleted.setOriginalClaimId(claim.getId());
        deleted.setClaimNumber(claim.getClaimNumber());
        deleted.setUserId(claim.getUserId());
        deleted.setPolicyId(claim.getPolicyId());
        deleted.setClaimAmount(claim.getClaimAmount());
        deleted.setApprovedAmount(claim.getApprovedAmount());
        deleted.setStatus(claim.getStatus());
        deleted.setDescription(claim.getDescription());
        deleted.setDocumentPath(claim.getDocumentPath());
        deleted.setRejectionReason(claim.getRejectionReason());
        deleted.setReviewedAt(claim.getReviewedAt());
        deleted.setOriginalCreatedAt(claim.getCreatedAt());
        deleted.setDeletedAt(LocalDateTime.now());
        return deleted;
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

    private DeletedClaimDTO toDeletedDTO(DeletedClaim deleted) {
        DeletedClaimDTO dto = new DeletedClaimDTO();
        dto.setId(deleted.getId());
        dto.setOriginalClaimId(deleted.getOriginalClaimId());
        dto.setClaimNumber(deleted.getClaimNumber());
        dto.setUserId(deleted.getUserId());
        dto.setPolicyId(deleted.getPolicyId());
        dto.setClaimAmount(deleted.getClaimAmount());
        dto.setApprovedAmount(deleted.getApprovedAmount());
        dto.setStatus(deleted.getStatus() != null ? deleted.getStatus().name() : null);
        dto.setDescription(deleted.getDescription());
        dto.setDocumentPath(deleted.getDocumentPath());
        dto.setRejectionReason(deleted.getRejectionReason());
        dto.setReviewedAt(deleted.getReviewedAt());
        dto.setOriginalCreatedAt(deleted.getOriginalCreatedAt());
        dto.setDeletedAt(deleted.getDeletedAt());
        return dto;
    }
}