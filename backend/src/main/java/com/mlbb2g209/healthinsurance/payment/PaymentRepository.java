package com.mlbb2g209.healthinsurance.payment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA Repository for Payment entities.
 * Belongs to Module: Premium Payment Management (Lakshani J.D.C.)
 */
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByTransactionId(String transactionId);

    Optional<Payment> findByReceiptNumber(String receiptNumber);

    List<Payment> findByUserId(Long userId);

    List<Payment> findByPolicyId(Long policyId);

    List<Payment> findByStatus(String status);

    List<Payment> findAllByOrderByCreatedAtDesc();

    boolean existsByTransactionId(String transactionId);

    boolean existsByReceiptNumber(String receiptNumber);
}
