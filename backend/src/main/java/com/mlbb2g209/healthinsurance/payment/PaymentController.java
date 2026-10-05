package com.mlbb2g209.healthinsurance.payment;

import com.mlbb2g209.healthinsurance.common.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST Controller for Premium Payment Management.
 * Provides endpoints for creating payments, querying payment history,
 * processing refunds with reason codes, and retrieving digital receipts.
 * Belongs to Module: Premium Payment Management (Lakshani J.D.C.)
 */
@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    /**
     * Retrieve all payments ordered by most recent first.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<PaymentDTO>>> getAllPayments() {
        List<PaymentDTO> payments = paymentService.getAllPayments();
        return ResponseEntity.ok(ApiResponse.success("Payments retrieved successfully", payments));
    }

    /**
     * Retrieve a single payment record by its internal ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PaymentDTO>> getPaymentById(@PathVariable Long id) {
        PaymentDTO payment = paymentService.getPaymentById(id);
        return ResponseEntity.ok(ApiResponse.success("Payment retrieved successfully", payment));
    }

    /**
     * Look up payment details by unique transaction reference (e.g. TXN-XXXXXX).
     */
    @GetMapping("/transaction/{transactionId}")
    public ResponseEntity<ApiResponse<PaymentDTO>> getPaymentByTransactionId(@PathVariable String transactionId) {
        PaymentDTO payment = paymentService.getPaymentByTransactionId(transactionId);
        return ResponseEntity.ok(ApiResponse.success("Payment retrieved successfully", payment));
    }

    /**
     * Retrieve all payment history records for a specific policyholder user.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<PaymentDTO>>> getPaymentsByUserId(@PathVariable Long userId) {
        List<PaymentDTO> payments = paymentService.getPaymentsByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success("User payments retrieved successfully", payments));
    }

    /**
     * Retrieve all payment history records for a specific insurance policy.
     */
    @GetMapping("/policy/{policyId}")
    public ResponseEntity<ApiResponse<List<PaymentDTO>>> getPaymentsByPolicyId(@PathVariable Long policyId) {
        List<PaymentDTO> payments = paymentService.getPaymentsByPolicyId(policyId);
        return ResponseEntity.ok(ApiResponse.success("Policy payments retrieved successfully", payments));
    }

    /**
     * Process an online premium payment.
     * Generates a unique transaction reference and receipt number.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<PaymentDTO>> processPayment(@RequestBody PaymentDTO paymentDTO) {
        PaymentDTO processed = paymentService.processPayment(paymentDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Payment processed successfully", processed));
    }

    /**
     * Process a refund for an existing COMPLETED payment with mandatory reason logging.
     */
    @PostMapping("/{id}/refund")
    public ResponseEntity<ApiResponse<PaymentDTO>> processRefund(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> payload) {
        String reason = (payload != null && payload.containsKey("refundReason")) 
                ? payload.get("refundReason") 
                : (payload != null ? payload.get("reason") : null);

        PaymentDTO refunded = paymentService.processRefund(id, reason);
        return ResponseEntity.ok(ApiResponse.success("Payment refund processed successfully", refunded));
    }

    /**
     * Cancel an in-flight or pending payment transaction.
     */
    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<PaymentDTO>> cancelPayment(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> payload) {
        String reason = (payload != null && payload.containsKey("reason")) 
                ? payload.get("reason") 
                : "Cancelled by user";

        PaymentDTO cancelled = paymentService.cancelPayment(id, reason);
        return ResponseEntity.ok(ApiResponse.success("Payment cancelled successfully", cancelled));
    }

    /**
     * Retrieve printable/exportable receipt data for a payment.
     */
    @GetMapping("/{id}/receipt")
    public ResponseEntity<ApiResponse<PaymentDTO>> getReceipt(@PathVariable Long id) {
        PaymentDTO receipt = paymentService.getReceiptByPaymentId(id);
        return ResponseEntity.ok(ApiResponse.success("Payment receipt retrieved successfully", receipt));
    }

    /**
     * Module-level exception handler to ensure client receives informative 400 Bad Request
     * without modifying shared GlobalExceptionHandler.
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Object>> handleIllegalArgumentException(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(ex.getMessage()));
    }

    /**
     * Module-level exception handler for state conflicts (e.g. duplicate refunds) returning 409 Conflict.
     */
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ApiResponse<Object>> handleIllegalStateException(IllegalStateException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiResponse.error(ex.getMessage()));
    }
}
