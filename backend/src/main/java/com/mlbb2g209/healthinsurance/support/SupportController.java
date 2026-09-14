package com.mlbb2g209.healthinsurance.support;

import com.mlbb2g209.healthinsurance.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/support")
public class SupportController {

    private final SupportService supportService;

    public SupportController(SupportService supportService) {
        this.supportService = supportService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SupportDTO>>> getAllTickets() {
        List<SupportDTO> tickets = supportService.getAllTickets();
        return ResponseEntity.ok(ApiResponse.success("Support tickets retrieved successfully", tickets));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SupportDTO>> getTicketById(@PathVariable Long id) {
        SupportDTO ticket = supportService.getTicketById(id);
        return ResponseEntity.ok(ApiResponse.success("Support ticket retrieved successfully", ticket));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SupportDTO>> createTicket(@RequestBody SupportDTO supportDTO) {
        SupportDTO created = supportService.createTicket(supportDTO);
        return ResponseEntity.ok(ApiResponse.success("Support ticket created successfully", created));
    }
}
