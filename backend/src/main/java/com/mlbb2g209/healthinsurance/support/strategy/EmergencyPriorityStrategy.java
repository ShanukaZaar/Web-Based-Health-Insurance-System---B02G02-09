package com.mlbb2g209.healthinsurance.support.strategy;

import com.mlbb2g209.healthinsurance.support.SupportDTO;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;


@Component
@Order(10)
public class EmergencyPriorityStrategy implements TicketPriorityStrategy {

    private static final List<String> EMERGENCY_KEYWORDS = List.of(
            "emergency", "icu", "critical", "ambulance", "surgery",
            "life threatening", "urgent", "accident", "trauma", "cardiac"
    );

    @Override
    public boolean supports(SupportDTO dto) {
        String combined = ((dto.getSubject() != null ? dto.getSubject() : "") + " " +
                (dto.getDescription() != null ? dto.getDescription() : "")).toLowerCase();

        return EMERGENCY_KEYWORDS.stream().anyMatch(combined::contains);
    }

    @Override
    public String determinePriority(SupportDTO dto) {
        return "HIGH";
    }

    @Override
    public String getStrategyName() {
        return "Emergency Priority Strategy";
    }

    @Override
    public int getOrder() {
        return 10;
    }
}
