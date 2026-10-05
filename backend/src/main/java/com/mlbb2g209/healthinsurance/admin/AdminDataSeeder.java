package com.mlbb2g209.healthinsurance.admin;

import com.mlbb2g209.healthinsurance.claim.Claim;
import com.mlbb2g209.healthinsurance.claim.ClaimRepository;
import com.mlbb2g209.healthinsurance.claim.ClaimStatus;
import com.mlbb2g209.healthinsurance.hospital.Hospital;
import com.mlbb2g209.healthinsurance.hospital.HospitalRepository;
import com.mlbb2g209.healthinsurance.payment.Payment;
import com.mlbb2g209.healthinsurance.payment.PaymentRepository;
import com.mlbb2g209.healthinsurance.policy.Policy;
import com.mlbb2g209.healthinsurance.policy.PolicyRepository;
import com.mlbb2g209.healthinsurance.support.SupportRepository;
import com.mlbb2g209.healthinsurance.support.SupportTicket;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Component
public class AdminDataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ReportRepository reportRepository;
    private final AuditLogRepository auditLogRepository;
    private final PolicyRepository policyRepository;
    private final ClaimRepository claimRepository;
    private final PaymentRepository paymentRepository;
    private final HospitalRepository hospitalRepository;
    private final SupportRepository supportRepository;

    public AdminDataSeeder(
            UserRepository userRepository,
            RoleRepository roleRepository,
            ReportRepository reportRepository,
            AuditLogRepository auditLogRepository,
            PolicyRepository policyRepository,
            ClaimRepository claimRepository,
            PaymentRepository paymentRepository,
            HospitalRepository hospitalRepository,
            SupportRepository supportRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.reportRepository = reportRepository;
        this.auditLogRepository = auditLogRepository;
        this.policyRepository = policyRepository;
        this.claimRepository = claimRepository;
        this.paymentRepository = paymentRepository;
        this.hospitalRepository = hospitalRepository;
        this.supportRepository = supportRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Seed Roles
        Role adminRole = roleRepository.findByName("ROLE_ADMIN").orElseGet(() ->
                roleRepository.save(new Role("ROLE_ADMIN", "System Administrator Access")));
        Role userRole = roleRepository.findByName("ROLE_USER").orElseGet(() ->
                roleRepository.save(new Role("ROLE_USER", "Standard System User")));
        Role agentRole = roleRepository.findByName("ROLE_AGENT").orElseGet(() ->
                roleRepository.save(new Role("ROLE_AGENT", "Insurance Field Agent")));

        // Seed Admin & Users if empty
        if (userRepository.count() == 0) {
            Set<Role> adminRoles = new HashSet<>();
            adminRoles.add(adminRole);
            User adminUser = userRepository.save(new User(
                    "admin",
                    "admin@healthinsure.com",
                    "$2a$10$e731K/0h8d10S8842eJ9u.c67e8E9b30r0.Fj79i373g.8", // dummy hash
                    "System",
                    "Administrator",
                    "+1-800-555-0199",
                    true,
                    adminRoles
            ));

            Set<Role> standardRoles = new HashSet<>();
            standardRoles.add(userRole);

            User u1 = userRepository.save(new User("john_doe", "john.doe@example.com", "hash1", "John", "Doe", "+1-555-0101", true, standardRoles));
            User u2 = userRepository.save(new User("sarah_connor", "sarah.c@example.com", "hash2", "Sarah", "Connor", "+1-555-0102", true, standardRoles));
            User u3 = userRepository.save(new User("mike_smith", "mike.s@example.com", "hash3", "Mike", "Smith", "+1-555-0103", false, standardRoles));
            Set<Role> agentRoles = new HashSet<>();
            agentRoles.add(agentRole);
            User u4 = userRepository.save(new User("emily_watson", "emily.w@example.com", "hash4", "Emily", "Watson", "+1-555-0104", true, agentRoles));

            // Seed Policies
            if (policyRepository.count() == 0) {
                policyRepository.save(new Policy("POL-1001", "Comprehensive Health Shield", "Full family healthcare coverage including hospitalization", new BigDecimal("500000.00"), new BigDecimal("450.00"), "INDIVIDUAL", "ACTIVE"));
                policyRepository.save(new Policy("POL-1002", "Family Care Plus", "Premium coverage for up to 5 family members", new BigDecimal("1000000.00"), new BigDecimal("850.00"), "FAMILY", "ACTIVE"));
                policyRepository.save(new Policy("POL-1003", "Senior Citizen Support", "Specialized geriatric medical plan with low deductible", new BigDecimal("300000.00"), new BigDecimal("600.00"), "SENIOR", "ACTIVE"));
                policyRepository.save(new Policy("POL-1004", "Basic Emergency Cover", "Emergency ward and accident hospitalization plan", new BigDecimal("100000.00"), new BigDecimal("200.00"), "BASIC", "INACTIVE"));
            }

            // Seed Claims
            if (claimRepository.count() == 0) {
                claimRepository.save(new Claim("CLM-8001", u1.getId(), 1L, new BigDecimal("12500.00"), new BigDecimal("12500.00"), ClaimStatus.APPROVED, "Emergency Cardiac Procedure at City Hospital"));
                claimRepository.save(new Claim("CLM-8002", u2.getId(), 2L, new BigDecimal("24800.00"), new BigDecimal("0.00"), ClaimStatus.PENDING, "ICU Admission and Diagnostic Scans"));
                claimRepository.save(new Claim("CLM-8003", u1.getId(), 1L, new BigDecimal("450.00"), new BigDecimal("450.00"), ClaimStatus.APPROVED, "Outpatient Specialist Consultation"));
                claimRepository.save(new Claim("CLM-8004", u3.getId(), 3L, new BigDecimal("3200.00"), new BigDecimal("0.00"), ClaimStatus.REJECTED, "Non-covered elective procedure"));
            }

            // Seed Payments
            if (paymentRepository.count() == 0) {
                paymentRepository.save(new Payment("TXN-9001", u1.getId(), 1L, null, new BigDecimal("450.00"), "CREDIT_CARD", "SUCCESSFUL"));
                paymentRepository.save(new Payment("TXN-9002", u2.getId(), 2L, null, new BigDecimal("850.00"), "BANK_TRANSFER", "SUCCESSFUL"));
                paymentRepository.save(new Payment("TXN-9003", u1.getId(), null, 1L, new BigDecimal("12500.00"), "DIRECT_DEPOSIT", "COMPLETED"));
                paymentRepository.save(new Payment("TXN-9004", u3.getId(), 3L, null, new BigDecimal("600.00"), "CREDIT_CARD", "FAILED"));
            }

            // Seed Hospitals
            if (hospitalRepository.count() == 0) {
                Hospital h1 = new Hospital();
                h1.setName("City General Hospital");
                h1.setHospitalCode("REG-101");
                h1.setAddress("125 Medical Center Blvd, Metropolis");
                h1.setCity("Metropolis");
                h1.setContactNumber("+1-800-555-0111");
                h1.setEmail("contact@citygeneral.org");
                h1.setStatus(com.mlbb2g209.healthinsurance.hospital.HospitalStatus.ACTIVE);
                hospitalRepository.save(h1);

                Hospital h2 = new Hospital();
                h2.setName("St. Jude Medical Center");
                h2.setHospitalCode("REG-102");
                h2.setAddress("88 Care Way, Gotham");
                h2.setCity("Gotham");
                h2.setContactNumber("+1-800-555-0222");
                h2.setEmail("info@stjude.org");
                h2.setStatus(com.mlbb2g209.healthinsurance.hospital.HospitalStatus.ACTIVE);
                hospitalRepository.save(h2);

                Hospital h3 = new Hospital();
                h3.setName("Sunrise Community Clinic");
                h3.setHospitalCode("REG-103");
                h3.setAddress("404 Sunset Drive, Smallville");
                h3.setCity("Smallville");
                h3.setContactNumber("+1-800-555-0333");
                h3.setEmail("desk@sunriseclinic.org");
                h3.setStatus(com.mlbb2g209.healthinsurance.hospital.HospitalStatus.INACTIVE);
                hospitalRepository.save(h3);
            }

            // Seed Support Tickets
            if (supportRepository.count() == 0) {
                supportRepository.save(new SupportTicket("TKT-5001", u1.getId(), "Policy Auto-Renewal Question", "Would like to know if my coverage renews automatically next month.", "OPEN", "MEDIUM"));
                supportRepository.save(new SupportTicket("TKT-5002", u2.getId(), "Claim Reimbursement Delay", "Submitted claim CLM-8002 three days ago, checking status.", "IN_PROGRESS", "HIGH"));
                supportRepository.save(new SupportTicket("TKT-5003", u3.getId(), "Empanelled Hospital List Update", "Inquiring if Sunrise Clinic is still under network coverage.", "RESOLVED", "LOW"));
            }

            // Seed Reports
            if (reportRepository.count() == 0) {
                reportRepository.save(new Report("Q3 Claim Breakdown Audit", "CLAIM", adminUser.getId(), "/exports/claim_q3_report.csv"));
                reportRepository.save(new Report("Annual Financial & Payment Summary", "PAYMENT", adminUser.getId(), "/exports/payment_annual_report.csv"));
                reportRepository.save(new Report("Policy Distribution & Renewal Analysis", "POLICY", adminUser.getId(), "/exports/policy_distribution_report.csv"));
            }

            // Seed Audit Logs
            if (auditLogRepository.count() == 0) {
                auditLogRepository.save(new AuditLog(adminUser.getId(), "admin", "SYSTEM_INIT", "Database seed completed with default system configuration."));
                auditLogRepository.save(new AuditLog(adminUser.getId(), "admin", "ADMIN_LOGIN", "Administrator logged into backend management suite."));
                auditLogRepository.save(new AuditLog(adminUser.getId(), "admin", "REPORT_GENERATED", "Generated Q3 Claim Breakdown Audit report."));
                auditLogRepository.save(new AuditLog(adminUser.getId(), "admin", "USER_STATUS_CHANGED", "Deactivated user mike_smith due to account review."));
            }
        }
    }
}
