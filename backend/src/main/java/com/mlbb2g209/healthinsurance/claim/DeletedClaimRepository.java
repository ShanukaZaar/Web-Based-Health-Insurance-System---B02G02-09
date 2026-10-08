package com.mlbb2g209.healthinsurance.claim;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeletedClaimRepository extends JpaRepository<DeletedClaim, Long> {
    Optional<DeletedClaim> findByClaimNumber(String claimNumber);
    List<DeletedClaim> findByUserId(Long userId);
}