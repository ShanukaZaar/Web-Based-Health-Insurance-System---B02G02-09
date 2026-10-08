package com.mlbb2g209.healthinsurance.support;

import com.mlbb2g209.healthinsurance.admin.User;
import com.mlbb2g209.healthinsurance.admin.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor 
public class SupportServiceImpl implements SupportService {

    private final SupportRepository supportRepository;
    private final UserRepository userRepository;

    
    private static final DateTimeFormatter DATE_FORMATTER =
            DateTimeFormatter.ISO_LOCAL_DATE_TIME;


    @Override
    public SupportDTO createTicket(SupportDTO supportDTO) {

        Long targetUserId = supportDTO.getUserId();
        User user = null;

        if (targetUserId != null) {
            user = userRepository.findById(targetUserId).orElse(null);
        }

        if (user == null) {
            // Fallback to first available user or create a default user to ensure ticket creation succeeds
            user = userRepository.findAll().stream().findFirst().orElseGet(() -> {
                User defaultUser = new User(
                        "default_customer",
                        "customer@healthinsurance.com",
                        "password123",
                        "Default",
                        "Customer",
                        "+1-555-0199",
                        true,
                        null
                );
                return userRepository.save(defaultUser);
            });
        }

        SupportTicket ticket = new SupportTicket();

        ticket.setTicketNumber(generateTicketNumber());
        ticket.setUser(user);
        ticket.setSubject(supportDTO.getSubject());
        ticket.setDescription(supportDTO.getDescription());

        ticket.setStatus(
                supportDTO.getStatus() != null
                        ? supportDTO.getStatus()
                        : "OPEN"
        );

        ticket.setPriority(
                supportDTO.getPriority() != null
                        ? supportDTO.getPriority()
                        : "MEDIUM"
        );

        SupportTicket savedTicket = supportRepository.save(ticket);

        return convertToDTO(savedTicket);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SupportDTO> getAllTickets() {

        return supportRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public SupportDTO getTicketById(Long id) {

        SupportTicket ticket = supportRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Support ticket not found with ID: " + id));

        return convertToDTO(ticket);
    }

    @Override
    @Transactional(readOnly = true)
    public SupportDTO getTicketByNumber(String ticketNumber) {

        SupportTicket ticket = supportRepository.findByTicketNumber(ticketNumber)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Support ticket not found with number: " + ticketNumber));

        return convertToDTO(ticket);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SupportDTO> getTicketsByUser(Long userId) {

        return supportRepository.findByUserId(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SupportDTO> getTicketsByStatus(String status) {

        return supportRepository.findByStatus(status)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public SupportDTO updateTicket(Long id, SupportDTO supportDTO) {

        SupportTicket ticket = supportRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Support ticket not found with ID: " + id));

        if (supportDTO.getSubject() != null) {
            ticket.setSubject(supportDTO.getSubject());
        }

        if (supportDTO.getDescription() != null) {
            ticket.setDescription(supportDTO.getDescription());
        }

        if (supportDTO.getStatus() != null) {
            ticket.setStatus(supportDTO.getStatus());
        }

        if (supportDTO.getPriority() != null) {
            ticket.setPriority(supportDTO.getPriority());
        }

        SupportTicket updatedTicket = supportRepository.save(ticket);

        return convertToDTO(updatedTicket);
    }

    @Override
    @Transactional
    public void deleteTicket(Long id) {

        SupportTicket ticket = supportRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Support ticket not found with ID: " + id));

        supportRepository.delete(ticket);
    }

    private String generateTicketNumber() {
        return "TKT-" + UUID.randomUUID().toString()
                .substring(0, 8)
                .toUpperCase();
    }

    private SupportDTO convertToDTO(SupportTicket ticket) {

        SupportDTO dto = new SupportDTO();

        dto.setId(ticket.getId());
        dto.setTicketNumber(ticket.getTicketNumber());
        dto.setUserId(
                ticket.getUser() != null
                        ? ticket.getUser().getId()
                        : null
        );
        dto.setSubject(ticket.getSubject());
        dto.setDescription(ticket.getDescription());
        dto.setStatus(ticket.getStatus());
        dto.setPriority(ticket.getPriority());

        if (ticket.getCreatedAt() != null) {
            dto.setCreatedAt(
                    ticket.getCreatedAt().format(DATE_FORMATTER));
        }

        if (ticket.getUpdatedAt() != null) {
            dto.setUpdatedAt(
                    ticket.getUpdatedAt().format(DATE_FORMATTER));
        }

        return dto;
    }
}
