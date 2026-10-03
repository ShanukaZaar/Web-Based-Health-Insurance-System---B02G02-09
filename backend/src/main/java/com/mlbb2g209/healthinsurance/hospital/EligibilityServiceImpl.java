package com.mlbb2g209.healthinsurance.hospital;

import com.mlbb2g209.healthinsurance.policy.Policy;
import com.mlbb2g209.healthinsurance.policy.PolicyRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class EligibilityServiceImpl implements EligibilityService {

    private final PolicyRepository policyRepository;

    public EligibilityServiceImpl(PolicyRepository policyRepository) {
        this.policyRepository = policyRepository;
    }

    @Override
    public EligibilityCheck checkEligibility(Long policyId) {
        return policyRepository.findById(policyId)
                .map(this::evaluate)
                .orElse(new EligibilityCheck(false, "NOT_FOUND", BigDecimal.ZERO,
                        "No policy found with id " + policyId));
    }

    private EligibilityCheck evaluate(Policy policy) {
        // NOTE: this only checks the policy's current status and its full
        // coverage amount. It does NOT subtract amounts already paid out via
        // approved claims or hospital bills -- that requires reading data
        // from the Claim and Hospital Bill modules together, which needs to
        // be designed as a team decision, not assumed here.
        boolean active = "ACTIVE".equalsIgnoreCase(policy.getStatus());

        if (!active) {
            return new EligibilityCheck(false, policy.getStatus(), BigDecimal.ZERO,
                    "Policy is not active. Treatment cannot be pre-authorized.");
        }

        return new EligibilityCheck(true, policy.getStatus(), policy.getCoverageAmount(),
                "Policy is active. Coverage amount shown does not yet account for prior claims.");
    }
}