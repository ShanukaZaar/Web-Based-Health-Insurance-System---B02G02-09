package com.mlbb2g209.healthinsurance.payment;

import com.mlbb2g209.healthinsurance.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PaymentDTO>>> getAllPayments() {
        List<PaymentDTO> payments = paymentService.getAllPayments();
        return ResponseEntity.ok(ApiResponse.success("Payments retrieved successfully", payments));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PaymentDTO>> getPaymentById(@PathVariable Long id) {
        PaymentDTO payment = paymentService.getPaymentById(id);
        return ResponseEntity.ok(ApiResponse.success("Payment retrieved successfully", payment));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PaymentDTO>> processPayment(@RequestBody PaymentDTO paymentDTO) {
        PaymentDTO processed = paymentService.processPayment(paymentDTO);
        return ResponseEntity.ok(ApiResponse.success("Payment processed successfully", processed));
    }
}
