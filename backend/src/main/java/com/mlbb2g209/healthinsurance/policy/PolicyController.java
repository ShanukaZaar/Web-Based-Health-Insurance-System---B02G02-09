package com.mlbb2g209.healthinsurance.policy;

import com.mlbb2g209.healthinsurance.common.ApiResponse;
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

    @PostMapping
    public ResponseEntity<ApiResponse<PolicyDTO>> createPolicy(@RequestBody PolicyDTO policyDTO) {
        PolicyDTO created = policyService.createPolicy(policyDTO);
        return ResponseEntity.ok(ApiResponse.success("Policy created successfully", created));
    }
}
