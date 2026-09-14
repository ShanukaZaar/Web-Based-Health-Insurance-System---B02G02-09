package com.mlbb2g209.healthinsurance.policy;

import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class PolicyServiceImpl implements PolicyService {

    private final PolicyRepository policyRepository;

    public PolicyServiceImpl(PolicyRepository policyRepository) {
        this.policyRepository = policyRepository;
    }

    @Override
    public List<PolicyDTO> getAllPolicies() {
        return Collections.emptyList();
    }

    @Override
    public PolicyDTO getPolicyById(Long id) {
        return null;
    }

    @Override
    public PolicyDTO createPolicy(PolicyDTO policyDTO) {
        return policyDTO;
    }
}
