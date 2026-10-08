package com.mlbb2g209.healthinsurance.support.strategy;

import com.mlbb2g209.healthinsurance.support.SupportDTO;

public interface TicketPriorityStrategy {

    boolean supports(SupportDTO dto);

    String determinePriority(SupportDTO dto);

    String getStrategyName();

    default int getOrder() {
        return 100;
    }
}
