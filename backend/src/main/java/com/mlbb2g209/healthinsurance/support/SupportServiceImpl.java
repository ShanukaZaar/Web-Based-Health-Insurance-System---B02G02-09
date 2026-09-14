package com.mlbb2g209.healthinsurance.support;

import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class SupportServiceImpl implements SupportService {

    private final SupportRepository supportRepository;

    public SupportServiceImpl(SupportRepository supportRepository) {
        this.supportRepository = supportRepository;
    }

    @Override
    public List<SupportDTO> getAllTickets() {
        return Collections.emptyList();
    }

    @Override
    public SupportDTO getTicketById(Long id) {
        return null;
    }

    @Override
    public SupportDTO createTicket(SupportDTO supportDTO) {
        return supportDTO;
    }
}
