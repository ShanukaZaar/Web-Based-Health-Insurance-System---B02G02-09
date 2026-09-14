package com.mlbb2g209.healthinsurance.claim;

import com.mlbb2g209.healthinsurance.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/claims")
public class ClaimController {

    private final ClaimService claimService;

    public ClaimController(ClaimService claimService) {
        this.claimService = claimService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ClaimDTO>>> getAllClaims() {
        List<ClaimDTO> claims = claimService.getAllClaims();
        return ResponseEntity.ok(ApiResponse.success("Claims retrieved successfully", claims));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ClaimDTO>> getClaimById(@PathVariable Long id) {
        ClaimDTO claim = claimService.getClaimById(id);
        return ResponseEntity.ok(ApiResponse.success("Claim retrieved successfully", claim));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ClaimDTO>> submitClaim(@RequestBody ClaimDTO claimDTO) {
        ClaimDTO created = claimService.submitClaim(claimDTO);
        return ResponseEntity.ok(ApiResponse.success("Claim submitted successfully", created));
    }
}
