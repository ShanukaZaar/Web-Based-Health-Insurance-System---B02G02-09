package com.mlbb2g209.healthinsurance.policy;

import java.util.List;

public interface PolicyService {

    // CREATE
    PolicyDTO createPolicy(PolicyDTO policyDTO);

    // READ
    List<PolicyDTO> getAllPolicies();

    PolicyDTO getPolicyById(Long id);

    List<PolicyDTO> getPoliciesByStatus(String status);

    // UPDATE
    PolicyDTO updatePolicy(Long id, PolicyDTO policyDTO);

    // DELETE (soft-cancel)
    void deletePolicy(Long id);
}
