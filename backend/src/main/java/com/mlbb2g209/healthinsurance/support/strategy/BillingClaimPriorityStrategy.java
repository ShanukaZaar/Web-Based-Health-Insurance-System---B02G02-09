package com.mlbb2g209.healthinsurance.support.strategy;

import com.mlbb2g209.healthinsurance.support.SupportDTO;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Order(20)
public class BillingClaimPriorityStrategy implements TicketPriorityStrategy {

    private static final List<String> BILLING_KEYWORDS = List.of(
            "claim", "refund", "rejected", "rejection", "denied",
            "payment failed", "charge", "hospital bill", "dispute", "reimbursement"
    );

    @Override
    public boolean supports(SupportDTO dto) {
        String combined = ((dto.getSubject() != null ? dto.getSubject() : "") + " " +
                (dto.getDescription() != null ? dto.getDescription() : "")).toLowerCase();

        return BILLING_KEYWORDS.stream().anyMatch(combined::contains);
    }

    @Override
    public String determinePriority(SupportDTO dto) {
        return "HIGH";
    }

    @Override
    public String getStrategyName() {
        return "Billing & Claim Dispute Priority Strategy";
    }

    @Override
    public int getOrder() {
        return 20;
    }
}
