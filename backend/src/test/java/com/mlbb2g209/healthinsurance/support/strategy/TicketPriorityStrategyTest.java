package com.mlbb2g209.healthinsurance.support.strategy;

import com.mlbb2g209.healthinsurance.support.SupportDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit Tests for the Strategy Pattern implementation in Customer Support Module.
 * Tests individual concrete strategies and runtime context resolution.
 * Student: Nemsith K.B.N (IT25101054)
 */
class TicketPriorityStrategyTest {

    private EmergencyPriorityStrategy emergencyStrategy;
    private BillingClaimPriorityStrategy billingStrategy;
    private GeneralInquiryPriorityStrategy inquiryStrategy;
    private DefaultPriorityStrategy defaultStrategy;
    private TicketPriorityContext context;

    @BeforeEach
    void setUp() {
        emergencyStrategy = new EmergencyPriorityStrategy();
        billingStrategy = new BillingClaimPriorityStrategy();
        inquiryStrategy = new GeneralInquiryPriorityStrategy();
        defaultStrategy = new DefaultPriorityStrategy();

        // Register strategies into the Context
        context = new TicketPriorityContext(
                List.of(emergencyStrategy, billingStrategy, inquiryStrategy, defaultStrategy),
                defaultStrategy
        );
    }

    @Test
    @DisplayName("Emergency strategy matches critical medical keywords and assigns HIGH priority")
    void testEmergencyStrategy() {
        SupportDTO dto = new SupportDTO();
        dto.setSubject("Patient ICU Admission Assistance");
        dto.setDescription("Requires urgent ambulance and surgery pre-authorization");

        assertTrue(emergencyStrategy.supports(dto));
        assertEquals("HIGH", emergencyStrategy.determinePriority(dto));
        assertEquals("HIGH", context.resolvePriority(dto));
    }

    @Test
    @DisplayName("Billing/Claim strategy matches claim rejection dispute keywords and assigns HIGH priority")
    void testBillingClaimStrategy() {
        SupportDTO dto = new SupportDTO();
        dto.setSubject("Hospitalization Claim Rejected");
        dto.setDescription("Hospital bill refund reimbursement was denied wrongfully");

        assertTrue(billingStrategy.supports(dto));
        assertEquals("HIGH", billingStrategy.determinePriority(dto));
        assertEquals("HIGH", context.resolvePriority(dto));
    }

    @Test
    @DisplayName("General Inquiry strategy matches informational queries and assigns LOW priority")
    void testGeneralInquiryStrategy() {
        SupportDTO dto = new SupportDTO();
        dto.setSubject("General inquiry on policy details");
        dto.setDescription("How to view coverage details and reset portal password");

        assertTrue(inquiryStrategy.supports(dto));
        assertEquals("LOW", inquiryStrategy.determinePriority(dto));
        assertEquals("LOW", context.resolvePriority(dto));
    }

    @Test
    @DisplayName("Fallback strategy respects user specified priority if no specialized keywords match")
    void testDefaultStrategyWithUserPriority() {
        SupportDTO dto = new SupportDTO();
        dto.setSubject("Update address");
        dto.setDescription("I moved to a new apartment");
        dto.setPriority("LOW");

        assertFalse(emergencyStrategy.supports(dto));
        assertFalse(billingStrategy.supports(dto));
        assertEquals("LOW", context.resolvePriority(dto));
    }

    @Test
    @DisplayName("Fallback strategy defaults to MEDIUM when no priority and no keywords provided")
    void testDefaultStrategyFallbackToMedium() {
        SupportDTO dto = new SupportDTO();
        dto.setSubject("Meeting follow-up");
        dto.setDescription("Follow-up on recent discussion");
        dto.setPriority(null);

        assertEquals("MEDIUM", context.resolvePriority(dto));
    }
}
