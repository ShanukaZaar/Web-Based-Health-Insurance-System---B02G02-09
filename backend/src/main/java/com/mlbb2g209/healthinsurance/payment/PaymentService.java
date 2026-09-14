package com.mlbb2g209.healthinsurance.payment;

import java.util.List;

public interface PaymentService {
    List<PaymentDTO> getAllPayments();
    PaymentDTO getPaymentById(Long id);
    PaymentDTO processPayment(PaymentDTO paymentDTO);
}
