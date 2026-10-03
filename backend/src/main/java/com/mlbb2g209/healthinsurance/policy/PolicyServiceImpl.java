package com.mlbb2g209.healthinsurance.policy;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Year;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PolicyServiceImpl implements PolicyService {

    private final PolicyRepository policyRepository;

    public PolicyServiceImpl(PolicyRepository policyRepository) {
        this.policyRepository = policyRepository;
    }

    // ======================== CREATE ========================

    @Override
    @Transactional
    public PolicyDTO createPolicy(PolicyDTO policyDTO) {
        Policy policy = new Policy();
        policy.setPolicyNumber(generatePolicyNumber());
        policy.setTitle(policyDTO.getTitle());
        policy.setDescription(policyDTO.getDescription());
        policy.setCoverageAmount(policyDTO.getCoverageAmount());
        policy.setPremiumAmount(policyDTO.getPremiumAmount());
        policy.setPolicyType(policyDTO.getPolicyType());
        policy.setStatus("ACTIVE");

        Policy saved = policyRepository.save(policy);
        return PolicyDTO.fromEntity(saved);
    }

    // ======================== READ ========================

    @Override
    public List<PolicyDTO> getAllPolicies() {
        return policyRepository.findAll()
                .stream()
                .map(PolicyDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public PolicyDTO getPolicyById(Long id) {
        Policy policy = policyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Policy not found with id: " + id));
        return PolicyDTO.fromEntity(policy);
    }

    @Override
    public List<PolicyDTO> getPoliciesByStatus(String status) {
        return policyRepository.findByStatus(status)
                .stream()
                .map(PolicyDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // ======================== UPDATE ========================

    @Override
    @Transactional
    public PolicyDTO updatePolicy(Long id, PolicyDTO policyDTO) {
        Policy policy = policyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Policy not found with id: " + id));

        // Prevent modification of cancelled policies
        if ("CANCELLED".equalsIgnoreCase(policy.getStatus())) {
            throw new RuntimeException("Cannot update a cancelled policy (ID: " + id + ")");
        }

        // Update mutable fields (only if provided)
        if (policyDTO.getTitle() != null) {
            policy.setTitle(policyDTO.getTitle());
        }
        if (policyDTO.getDescription() != null) {
            policy.setDescription(policyDTO.getDescription());
        }
        if (policyDTO.getCoverageAmount() != null) {
            policy.setCoverageAmount(policyDTO.getCoverageAmount());
        }
        if (policyDTO.getPremiumAmount() != null) {
            policy.setPremiumAmount(policyDTO.getPremiumAmount());
        }
        if (policyDTO.getPolicyType() != null) {
            policy.setPolicyType(policyDTO.getPolicyType());
        }
        if (policyDTO.getStatus() != null) {
            policy.setStatus(policyDTO.getStatus());
        }

        Policy saved = policyRepository.save(policy);
        return PolicyDTO.fromEntity(saved);
    }

    // ======================== DELETE (soft-cancel) ========================

    @Override
    @Transactional
    public void deletePolicy(Long id) {
        Policy policy = policyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Policy not found with id: " + id));

        if ("CANCELLED".equalsIgnoreCase(policy.getStatus())) {
            throw new RuntimeException("Policy is already cancelled (ID: " + id + ")");
        }

        // Soft-delete: mark as CANCELLED instead of removing the row.
        // Insurance policies are financial/legal records and should not be hard-deleted.
        policy.setStatus("CANCELLED");
        policyRepository.save(policy);
    }

    // ======================== Helpers ========================

    /**
     * Generates a unique policy number in the format: POL-YYYY-XXXXXXXX
     */
    private String generatePolicyNumber() {
        String candidate;
        do {
            candidate = "POL-" + Year.now().getValue() + "-"
                    + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (policyRepository.existsByPolicyNumber(candidate));
        return candidate;
    }
}
