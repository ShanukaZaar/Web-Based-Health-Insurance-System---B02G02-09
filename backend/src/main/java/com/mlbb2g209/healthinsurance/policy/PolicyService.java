package com.mlbb2g209.healthinsurance.policy;

import java.util.List;

public interface PolicyService {
    List<PolicyDTO> getAllPolicies();
    PolicyDTO getPolicyById(Long id);
    PolicyDTO createPolicy(PolicyDTO policyDTO);
}
