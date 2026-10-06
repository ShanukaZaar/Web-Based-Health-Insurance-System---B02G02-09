package com.mlbb2g209.healthinsurance.payment;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service Implementation for Premium Payment operations.
 * Implements business logic, safety checks, transaction reference generation, and refund controls.
 * Belongs to Module: Premium Payment Management (Lakshani J.D.C.)
 */
@Service
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentServiceImpl(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentDTO> getAllPayments() {
        return paymentRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentDTO getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Payment record not found with ID: " + id));
        return mapToDTO(payment);
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentDTO getPaymentByTransactionId(String transactionId) {
        Payment payment = paymentRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new IllegalArgumentException("Payment record not found with Transaction ID: " + transactionId));
        return mapToDTO(payment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentDTO> getPaymentsByUserId(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID must not be null.");
        }
        return paymentRepository.findByUserId(userId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentDTO> getPaymentsByPolicyId(Long policyId) {
        if (policyId == null) {
            throw new IllegalArgumentException("Policy ID must not be null.");
        }
        return paymentRepository.findByPolicyId(policyId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PaymentDTO processPayment(PaymentDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Payment details cannot be null.");
        }

        // Business Logic Safety: Amount validation (prevent zero or negative payment)
        if (dto.getAmount() == null || dto.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Payment amount must be greater than zero.");
        }

        if (dto.getUserId() == null) {
            throw new IllegalArgumentException("Policyholder User ID is required.");
        }

        if (dto.getPolicyId() == null) {
            throw new IllegalArgumentException("Target Insurance Policy ID is required.");
        }

        // Auto-generate unique transaction reference (e.g. TXN-XXXXXX) if not provided
        if (dto.getTransactionId() == null || dto.getTransactionId().trim().isEmpty()) {
            dto.setTransactionId(generateUniqueTransactionId());
        } else if (paymentRepository.existsByTransactionId(dto.getTransactionId())) {
            throw new IllegalArgumentException("Transaction ID already exists: " + dto.getTransactionId());
        }

        // Auto-generate official receipt number (e.g. RCP-XXXXXX)
        if (dto.getReceiptNumber() == null || dto.getReceiptNumber().trim().isEmpty()) {
            dto.setReceiptNumber(generateUniqueReceiptNumber());
        }

        // Default status and payment method handling
        if (dto.getStatus() == null || dto.getStatus().trim().isEmpty()) {
            dto.setStatus("COMPLETED");
        }

        if (dto.getPaymentMethod() == null || dto.getPaymentMethod().trim().isEmpty()) {
            dto.setPaymentMethod("CREDIT_CARD");
        }

        if (dto.getPaymentDate() == null) {
            dto.setPaymentDate(LocalDateTime.now());
        }

        Payment payment = mapToEntity(dto);
        Payment savedPayment = paymentRepository.save(payment);
        return mapToDTO(savedPayment);
    }

    @Override
    public PaymentDTO processRefund(Long id, String refundReason) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Payment record not found with ID: " + id));

        // Business Logic Safety: Prevent refunding twice
        if ("REFUNDED".equalsIgnoreCase(payment.getStatus())) {
            throw new IllegalStateException("Payment ID " + id + " has already been refunded.");
        }

        // Business Logic Safety: Only COMPLETED payments can be refunded
        if (!"COMPLETED".equalsIgnoreCase(payment.getStatus())) {
            throw new IllegalStateException("Cannot refund a payment with status: " + payment.getStatus() + ". Only COMPLETED transactions are eligible for refund.");
        }

        // Mandatory reason check
        if (refundReason == null || refundReason.trim().isEmpty()) {
            throw new IllegalArgumentException("A valid refund reason is mandatory (e.g., DUPLICATE_TRANSACTION, POLICY_CANCELLATION, OVERPAYMENT).");
        }

        payment.setStatus("REFUNDED");
        payment.setRefundReason(refundReason.trim());
        payment.setRefundDate(LocalDateTime.now());

        Payment updatedPayment = paymentRepository.save(payment);
        return mapToDTO(updatedPayment);
    }

    @Override
    public PaymentDTO cancelPayment(Long id, String reason) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Payment record not found with ID: " + id));

        if ("CANCELLED".equalsIgnoreCase(payment.getStatus())) {
            throw new IllegalStateException("Payment ID " + id + " has already been cancelled.");
        }

        if ("REFUNDED".equalsIgnoreCase(payment.getStatus())) {
            throw new IllegalStateException("Cannot cancel an already refunded transaction.");
        }

        payment.setStatus("CANCELLED");
        payment.setRefundReason(reason != null && !reason.trim().isEmpty() ? reason.trim() : "Cancelled by policyholder or administrator");
        payment.setRefundDate(LocalDateTime.now());

        Payment updatedPayment = paymentRepository.save(payment);
        return mapToDTO(updatedPayment);
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentDTO getReceiptByPaymentId(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Payment record not found with ID: " + id));

        return mapToDTO(payment);
    }

    private String generateUniqueTransactionId() {
        String randomPart = UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
        long timestampSuffix = System.currentTimeMillis() % 10000;
        return "TXN-" + randomPart + "-" + timestampSuffix;
    }

    private String generateUniqueReceiptNumber() {
        String randomPart = UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
        return "RCP-" + randomPart;
    }

    private PaymentDTO mapToDTO(Payment entity) {
        if (entity == null) {
            return null;
        }

        return new PaymentDTO(
                entity.getId(),
                entity.getTransactionId(),
                entity.getReceiptNumber(),
                entity.getUserId(),
                entity.getPolicyId(),
                entity.getClaimId(),
                entity.getAmount(),
                entity.getPaymentMethod(),
                entity.getStatus(),
                entity.getPaymentDate(),
                entity.getDescription(),
                entity.getRefundReason(),
                entity.getRefundDate(),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }

    private Payment mapToEntity(PaymentDTO dto) {
        if (dto == null) {
            return null;
        }

        Payment payment = new Payment(
                dto.getTransactionId(),
                dto.getReceiptNumber(),
                dto.getUserId(),
                dto.getPolicyId(),
                dto.getClaimId(),
                dto.getAmount(),
                dto.getPaymentMethod(),
                dto.getStatus(),
                dto.getPaymentDate(),
                dto.getDescription(),
                dto.getRefundReason(),
                dto.getRefundDate()
        );
        payment.setId(dto.getId());
        return payment;
    }
}
