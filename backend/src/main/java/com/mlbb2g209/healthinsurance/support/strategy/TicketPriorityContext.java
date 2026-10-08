package com.mlbb2g209.healthinsurance.support.strategy;

import com.mlbb2g209.healthinsurance.support.SupportDTO;
import lombok.Getter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;

@Getter
@Component
public class TicketPriorityContext {

    private static final Logger log = LoggerFactory.getLogger(TicketPriorityContext.class);

    private final List<TicketPriorityStrategy> strategies;
    private final DefaultPriorityStrategy defaultStrategy;

    public TicketPriorityContext(List<TicketPriorityStrategy> strategies, DefaultPriorityStrategy defaultStrategy) {
        // Exclude default fallback from the specialized chain and sort by order precedence
        this.strategies = strategies.stream()
                .filter(s -> !(s instanceof DefaultPriorityStrategy))
                .sorted(Comparator.comparingInt(TicketPriorityStrategy::getOrder))
                .toList();
        this.defaultStrategy = defaultStrategy;
    }

    public String resolvePriority(SupportDTO dto) {
        if (dto == null) {
            return "MEDIUM";
        }

        for (TicketPriorityStrategy strategy : strategies) {
            if (strategy.supports(dto)) {
                String priority = strategy.determinePriority(dto);
                log.info("[Strategy Pattern] Selected strategy '{}' for subject '{}' -> Priority: {}",
                        strategy.getStrategyName(), dto.getSubject(), priority);
                return priority;
            }
        }

        // Fallback strategy
        String fallbackPriority = defaultStrategy.determinePriority(dto);
        log.info("[Strategy Pattern] Applied fallback '{}' for subject '{}' -> Priority: {}",
                defaultStrategy.getStrategyName(), dto.getSubject(), fallbackPriority);
        return fallbackPriority;
    }

}
