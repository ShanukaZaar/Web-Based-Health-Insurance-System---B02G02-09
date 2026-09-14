package com.mlbb2g209.healthinsurance.payment;

import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentServiceImpl(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @Override
    public List<PaymentDTO> getAllPayments() {
        return Collections.emptyList();
    }

    @Override
    public PaymentDTO getPaymentById(Long id) {
        return null;
    }

    @Override
    public PaymentDTO processPayment(PaymentDTO paymentDTO) {
        return paymentDTO;
    }
}
