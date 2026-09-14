package com.mlbb2g209.healthinsurance.support;

import java.util.List;

public interface SupportService {
    List<SupportDTO> getAllTickets();
    SupportDTO getTicketById(Long id);
    SupportDTO createTicket(SupportDTO supportDTO);
}
