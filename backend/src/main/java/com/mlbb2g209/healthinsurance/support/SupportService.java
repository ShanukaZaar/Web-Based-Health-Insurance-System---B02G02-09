package com.mlbb2g209.healthinsurance.support;

import java.util.List;

public interface SupportService {

    SupportDTO createTicket(SupportDTO supportDTO);

    List<SupportDTO> getAllTickets();

    SupportDTO getTicketById(Long id);

    SupportDTO getTicketByNumber(String ticketNumber);

    List<SupportDTO> getTicketsByUser(Long userId);

    List<SupportDTO> getTicketsByStatus(String status);

    SupportDTO updateTicket(Long id, SupportDTO supportDTO);

    void deleteTicket(Long id);
}
