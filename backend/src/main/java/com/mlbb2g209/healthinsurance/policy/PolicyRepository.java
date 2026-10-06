package com.mlbb2g209.healthinsurance.policy;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PolicyRepository extends JpaRepository<Policy, Long> {

    Optional<Policy> findByPolicyNumber(String policyNumber);

    List<Policy> findByStatus(String status);

    List<Policy> findByPolicyType(String policyType);

    boolean existsByPolicyNumber(String policyNumber);
}
