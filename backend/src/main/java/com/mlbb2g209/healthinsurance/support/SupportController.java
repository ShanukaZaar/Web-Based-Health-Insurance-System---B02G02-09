package com.mlbb2g209.healthinsurance.support;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/support")
@CrossOrigin
@RequiredArgsConstructor
public class SupportController {

    private final SupportService supportService;

    // CREATE
    @PostMapping
    public ResponseEntity<SupportDTO> createTicket(
            @Valid @RequestBody SupportDTO supportDTO) {

        SupportDTO createdTicket =
                supportService.createTicket(supportDTO);

        return new ResponseEntity<>(
                createdTicket,
                HttpStatus.CREATED
        );
    }

    // READ - all tickets
    @GetMapping
    public ResponseEntity<List<SupportDTO>> getAllTickets() {

        return ResponseEntity.ok(
                supportService.getAllTickets()
        );
    }

    // READ - ticket by ID
    @GetMapping("/{id}")
    public ResponseEntity<SupportDTO> getTicketById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                supportService.getTicketById(id)
        );
    }

    // READ - ticket by ticket number
    @GetMapping("/number/{ticketNumber}")
    public ResponseEntity<SupportDTO> getTicketByNumber(
            @PathVariable String ticketNumber) {

        return ResponseEntity.ok(
                supportService.getTicketByNumber(ticketNumber)
        );
    }

    // READ - tickets belonging to a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SupportDTO>> getTicketsByUser(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                supportService.getTicketsByUser(userId)
        );
    }

    // READ - tickets by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<SupportDTO>> getTicketsByStatus(
            @PathVariable String status) {

        return ResponseEntity.ok(
                supportService.getTicketsByStatus(status)
        );
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<SupportDTO> updateTicket(
            @PathVariable Long id,
            @Valid @RequestBody SupportDTO supportDTO) {

        SupportDTO updatedTicket =
                supportService.updateTicket(id, supportDTO);

        return ResponseEntity.ok(updatedTicket);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(
            @PathVariable Long id) {

        supportService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }
}
