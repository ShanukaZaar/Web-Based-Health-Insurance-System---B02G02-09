package com.mlbb2g209.healthinsurance.health;

import com.mlbb2g209.healthinsurance.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, String>>> checkHealth() {
        Map<String, String> statusInfo = Map.of(
                "status", "UP",
                "application", "Web-Based Health Insurance Management System",
                "version", "0.0.1-SNAPSHOT"
        );
        return ResponseEntity.ok(ApiResponse.success("Health Insurance System API is running smoothly", statusInfo));
    }
}
