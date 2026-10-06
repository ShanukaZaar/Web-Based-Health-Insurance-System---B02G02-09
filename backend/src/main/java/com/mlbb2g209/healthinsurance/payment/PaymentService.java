package com.mlbb2g209.healthinsurance.payment;

import java.util.List;

/**
 * Service interface for Premium Payment operations.
 * Belongs to Module: Premium Payment Management (Lakshani J.D.C.)
 */
public interface PaymentService {

    List<PaymentDTO> getAllPayments();

    PaymentDTO getPaymentById(Long id);

    PaymentDTO getPaymentByTransactionId(String transactionId);

    List<PaymentDTO> getPaymentsByUserId(Long userId);

    List<PaymentDTO> getPaymentsByPolicyId(Long policyId);

    PaymentDTO processPayment(PaymentDTO paymentDTO);

    PaymentDTO processRefund(Long id, String refundReason);

    PaymentDTO cancelPayment(Long id, String reason);

    PaymentDTO getReceiptByPaymentId(Long id);
}
