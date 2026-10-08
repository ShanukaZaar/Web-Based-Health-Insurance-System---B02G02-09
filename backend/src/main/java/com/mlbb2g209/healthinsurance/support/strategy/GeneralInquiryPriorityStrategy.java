package com.mlbb2g209.healthinsurance.support.strategy;

import com.mlbb2g209.healthinsurance.support.SupportDTO;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Order(30)
public class GeneralInquiryPriorityStrategy implements TicketPriorityStrategy {

    private static final List<String> INQUIRY_KEYWORDS = List.of(
            "how to", "inquiry", "info", "information", "question",
            "policy details", "portal", "profile", "password", "coverage details"
    );

    @Override
    public boolean supports(SupportDTO dto) {
        String combined = ((dto.getSubject() != null ? dto.getSubject() : "") + " " +
                (dto.getDescription() != null ? dto.getDescription() : "")).toLowerCase();

        return INQUIRY_KEYWORDS.stream().anyMatch(combined::contains);
    }

    @Override
    public String determinePriority(SupportDTO dto) {
        return "LOW";
    }

    @Override
    public String getStrategyName() {
        return "General Inquiry Priority Strategy";
    }

    @Override
    public int getOrder() {
        return 30;
    }
}
