package com.mlbb2g209.healthinsurance.hospital;

public interface EligibilityService {
    EligibilityCheck checkEligibility(Long policyId);
}