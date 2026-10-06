package com.mlbb2g209.healthinsurance.policy;

import com.mlbb2g209.healthinsurance.common.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/policies")
public class PolicyController {

    private final PolicyService policyService;

    public PolicyController(PolicyService policyService) {
        this.policyService = policyService;
    }

    // ======================== CREATE ========================

    @PostMapping
    public ResponseEntity<ApiResponse<PolicyDTO>> createPolicy(@RequestBody PolicyDTO policyDTO) {
        PolicyDTO created = policyService.createPolicy(policyDTO);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Policy created successfully", created));
    }

    // ======================== READ ========================

    @GetMapping
    public ResponseEntity<ApiResponse<List<PolicyDTO>>> getAllPolicies() {
        List<PolicyDTO> policies = policyService.getAllPolicies();
        return ResponseEntity.ok(ApiResponse.success("Policies retrieved successfully", policies));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PolicyDTO>> getPolicyById(@PathVariable Long id) {
        PolicyDTO policy = policyService.getPolicyById(id);
        return ResponseEntity.ok(ApiResponse.success("Policy retrieved successfully", policy));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<PolicyDTO>>> getPoliciesByStatus(@PathVariable String status) {
        List<PolicyDTO> policies = policyService.getPoliciesByStatus(status);
        return ResponseEntity.ok(ApiResponse.success("Policies filtered by status: " + status, policies));
    }

    // ======================== UPDATE ========================

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PolicyDTO>> updatePolicy(
            @PathVariable Long id,
            @RequestBody PolicyDTO policyDTO) {
        PolicyDTO updated = policyService.updatePolicy(id, policyDTO);
        return ResponseEntity.ok(ApiResponse.success("Policy updated successfully", updated));
    }

    // ======================== DELETE (soft-cancel) ========================

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePolicy(@PathVariable Long id) {
        policyService.deletePolicy(id);
        return ResponseEntity.ok(ApiResponse.success("Policy cancelled successfully"));
    }
}
