package com.mlbb2g209.healthinsurance.support.strategy;

import com.mlbb2g209.healthinsurance.support.SupportDTO;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;


@Component
@Order(100)
public class DefaultPriorityStrategy implements TicketPriorityStrategy {

    @Override
    public boolean supports(SupportDTO dto) {
        return true;
    }

    @Override
    public String determinePriority(SupportDTO dto) {
        if (dto != null && dto.getPriority() != null && !dto.getPriority().trim().isEmpty()) {
            return dto.getPriority().trim().toUpperCase();
        }
        return "MEDIUM";
    }

    @Override
    public String getStrategyName() {
        return "Default Fallback Priority Strategy";
    }

    @Override
    public int getOrder() {
        return 100;
    }
}
