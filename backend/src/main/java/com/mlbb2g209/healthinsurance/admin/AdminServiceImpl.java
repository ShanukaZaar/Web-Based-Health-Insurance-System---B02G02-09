package com.mlbb2g209.healthinsurance.admin;

import com.mlbb2g209.healthinsurance.claim.Claim;
import com.mlbb2g209.healthinsurance.claim.ClaimRepository;
import com.mlbb2g209.healthinsurance.hospital.Hospital;
import com.mlbb2g209.healthinsurance.hospital.HospitalRepository;
import com.mlbb2g209.healthinsurance.hospital.HospitalStatus;
import com.mlbb2g209.healthinsurance.payment.Payment;
import com.mlbb2g209.healthinsurance.payment.PaymentRepository;
import com.mlbb2g209.healthinsurance.policy.Policy;
import com.mlbb2g209.healthinsurance.policy.PolicyRepository;
import com.mlbb2g209.healthinsurance.support.SupportRepository;
import com.mlbb2g209.healthinsurance.support.SupportTicket;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ReportRepository reportRepository;
    private final AuditLogRepository auditLogRepository;
    private final PolicyRepository policyRepository;
    private final ClaimRepository claimRepository;
    private final PaymentRepository paymentRepository;
    private final HospitalRepository hospitalRepository;
    private final SupportRepository supportRepository;

    public AdminServiceImpl(
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

    private void logActivity(String action, String description) {
        AuditLog auditLog = new AuditLog(1L, "admin", action, description);
        auditLogRepository.save(auditLog);
    }

    private UserDTO convertToUserDTO(User user) {
        Set<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());
        return new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhoneNumber(),
                user.getIsActive(),
                roleNames,
                user.getCreatedAt()
        );
    }

    private ReportDTO convertToReportDTO(Report report) {
        return new ReportDTO(
                report.getId(),
                report.getReportTitle(),
                report.getReportType(),
                report.getGeneratedBy(),
                report.getFilePath(),
                report.getCreatedAt()
        );
    }

    private AuditLogDTO convertToAuditLogDTO(AuditLog log) {
        return new AuditLogDTO(
                log.getId(),
                log.getUserId(),
                log.getUsername(),
                log.getAction(),
                log.getDescription(),
                log.getCreatedAt()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();

        List<User> users = userRepository.findAll();
        stats.setTotalUsers(users.size());
        stats.setActiveUsers(users.stream().filter(u -> Boolean.TRUE.equals(u.getIsActive())).count());

        List<Policy> policies = policyRepository.findAll();
        stats.setTotalPolicies(policies.size());
        stats.setActivePolicies(policies.stream().filter(p -> "ACTIVE".equalsIgnoreCase(p.getStatus())).count());

        List<Claim> claims = claimRepository.findAll();
        stats.setTotalClaims(claims.size());
        stats.setPendingClaims(claims.stream().filter(c -> c.getStatus() != null &&
                (c.getStatus().name().contains("SUBMITTED") || c.getStatus().name().contains("PENDING"))).count());

        List<Payment> payments = paymentRepository.findAll();
        stats.setTotalPayments(payments.size());

        List<Hospital> hospitals = hospitalRepository.findAll();
        stats.setNetworkHospitals(hospitals.stream().filter(h -> h.getStatus() == HospitalStatus.ACTIVE).count());

        List<SupportTicket> tickets = supportRepository.findAll();
        stats.setOpenSupportTickets(tickets.stream().filter(t -> t.getStatus() != null &&
                ("OPEN".equalsIgnoreCase(t.getStatus()) || "IN_PROGRESS".equalsIgnoreCase(t.getStatus()))).count());

        // Financial Totals
        BigDecimal totalClaimAmt = claims.stream()
                .map(Claim::getClaimAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.setTotalClaimAmount(totalClaimAmt);

        BigDecimal totalApprovedAmt = claims.stream()
                .map(Claim::getApprovedAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.setTotalApprovedClaimAmount(totalApprovedAmt);

        BigDecimal totalPayAmt = payments.stream()
                .map(Payment::getAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.setTotalPaymentAmount(totalPayAmt);

        // Status Distributions
        Map<String, Long> claimDist = claims.stream()
                .collect(Collectors.groupingBy(c -> c.getStatus() != null ? c.getStatus().name() : "UNKNOWN", Collectors.counting()));
        stats.setClaimStatusDistribution(claimDist);

        Map<String, Long> payDist = payments.stream()
                .collect(Collectors.groupingBy(p -> p.getStatus() != null ? p.getStatus() : "UNKNOWN", Collectors.counting()));
        stats.setPaymentStatusDistribution(payDist);

        Map<String, Long> policyDist = policies.stream()
                .collect(Collectors.groupingBy(p -> p.getStatus() != null ? p.getStatus() : "UNKNOWN", Collectors.counting()));
        stats.setPolicyStatusDistribution(policyDist);

        Map<String, Long> supportPriorityDist = tickets.stream()
                .collect(Collectors.groupingBy(t -> t.getPriority() != null ? t.getPriority() : "MEDIUM", Collectors.counting()));
        stats.setSupportPriorityDistribution(supportPriorityDist);

        // Recent Audit Logs
        List<AuditLogDTO> recentLogs = auditLogRepository.findAllByOrderByCreatedAtDesc().stream()
                .limit(10)
                .map(this::convertToAuditLogDTO)
                .collect(Collectors.toList());
        stats.setRecentAuditLogs(recentLogs);

        return stats;
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDTO> getAllUsers(String search, Boolean activeOnly, String role) {
        return userRepository.findAll().stream()
                .filter(u -> {
                    if (search != null && !search.trim().isEmpty()) {
                        String q = search.toLowerCase();
                        boolean matchName = (u.getFirstName() != null && u.getFirstName().toLowerCase().contains(q))
                                || (u.getLastName() != null && u.getLastName().toLowerCase().contains(q));
                        boolean matchUsername = u.getUsername() != null && u.getUsername().toLowerCase().contains(q);
                        boolean matchEmail = u.getEmail() != null && u.getEmail().toLowerCase().contains(q);
                        if (!matchName && !matchUsername && !matchEmail) return false;
                    }
                    if (activeOnly != null && activeOnly) {
                        if (!Boolean.TRUE.equals(u.getIsActive())) return false;
                    }
                    if (role != null && !role.trim().isEmpty()) {
                        boolean hasRole = u.getRoles().stream().anyMatch(r -> r.getName().equalsIgnoreCase(role));
                        if (!hasRole) return false;
                    }
                    return true;
                })
                .map(this::convertToUserDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
        return convertToUserDTO(user);
    }

    @Override
    @Transactional
    public UserDTO createUser(UserDTO userDTO, String password) {
        if (userRepository.existsByUsername(userDTO.getUsername())) {
            throw new RuntimeException("Username '" + userDTO.getUsername() + "' is already taken.");
        }
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new RuntimeException("Email '" + userDTO.getEmail() + "' is already registered.");
        }

        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setEmail(userDTO.getEmail());
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setPhoneNumber(userDTO.getPhoneNumber());
        user.setIsActive(userDTO.getIsActive() != null ? userDTO.getIsActive() : true);
        // Store password as-is (plain text for dev; use BCrypt in production)
        user.setPasswordHash(password != null && !password.isEmpty() ? password : "changeme");

        // Assign roles
        Set<Role> roles = new HashSet<>();
        if (userDTO.getRoles() != null && !userDTO.getRoles().isEmpty()) {
            for (String roleName : userDTO.getRoles()) {
                roleRepository.findByName(roleName).ifPresent(roles::add);
            }
        }
        if (roles.isEmpty()) {
            roleRepository.findByName("ROLE_USER").ifPresent(roles::add);
        }
        user.setRoles(roles);

        User saved = userRepository.save(user);
        logActivity("USER_CREATED", "Created new user '" + saved.getUsername() + "' (ID: " + saved.getId() + ")");
        return convertToUserDTO(saved);
    }

    @Override
    @Transactional
    public UserDTO updateUser(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));

        if (userDTO.getFirstName() != null) user.setFirstName(userDTO.getFirstName());
        if (userDTO.getLastName() != null) user.setLastName(userDTO.getLastName());
        if (userDTO.getPhoneNumber() != null) user.setPhoneNumber(userDTO.getPhoneNumber());
        if (userDTO.getEmail() != null && !userDTO.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(userDTO.getEmail())) {
                throw new RuntimeException("Email '" + userDTO.getEmail() + "' is already in use.");
            }
            user.setEmail(userDTO.getEmail());
        }
        if (userDTO.getIsActive() != null) user.setIsActive(userDTO.getIsActive());

        // Update roles if provided
        if (userDTO.getRoles() != null && !userDTO.getRoles().isEmpty()) {
            Set<Role> roles = new HashSet<>();
            for (String roleName : userDTO.getRoles()) {
                roleRepository.findByName(roleName).ifPresent(roles::add);
            }
            user.setRoles(roles);
        }

        User updated = userRepository.save(user);
        logActivity("USER_UPDATED", "Updated user '" + updated.getUsername() + "' (ID: " + id + ")");
        return convertToUserDTO(updated);
    }

    @Override
    @Transactional
    public UserDTO updateUserStatus(Long id, Boolean active) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
        user.setIsActive(active);
        User updated = userRepository.save(user);
        logActivity("USER_STATUS_CHANGED", "Updated user '" + user.getUsername() + "' active status to " + active);

        return convertToUserDTO(updated);
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
        userRepository.delete(user);
        logActivity("USER_DELETED", "Deleted user '" + user.getUsername() + "' (ID: " + id + ")");
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReportDTO> getAllSystemReports() {
        return reportRepository.findAll().stream()
                .map(this::convertToReportDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ReportDTO generateReport(ReportDTO reportDTO) {
        Report report = new Report();
        report.setReportTitle(reportDTO.getReportTitle() != null ? reportDTO.getReportTitle() : "System Analytical Report");
        report.setReportType(reportDTO.getReportType() != null ? reportDTO.getReportType() : "SYSTEM_ACTIVITY");
        report.setGeneratedBy(reportDTO.getGeneratedBy() != null ? reportDTO.getGeneratedBy() : 1L);
        report.setFilePath("/exports/report_" + System.currentTimeMillis() + ".csv");

        Report saved = reportRepository.save(report);
        logActivity("REPORT_GENERATED", "Generated report '" + saved.getReportTitle() + "' (Type: " + saved.getReportType() + ")");

        return convertToReportDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ReportDTO getReportById(Long id) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found with ID: " + id));
        return convertToReportDTO(report);
    }

    @Override
    @Transactional
    public void deleteReport(Long id) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found with ID: " + id));
        reportRepository.delete(report);
        logActivity("REPORT_DELETED", "Deleted report '" + report.getReportTitle() + "' (ID: " + id + ")");
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] exportReportCsv(Long id) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found with ID: " + id));

        StringBuilder sb = new StringBuilder();
        sb.append("# ").append(report.getReportTitle()).append("\n");
        sb.append("# Type: ").append(report.getReportType()).append("\n");
        sb.append("# Generated At: ").append(report.getCreatedAt()).append("\n\n");

        String type = report.getReportType() != null ? report.getReportType().toUpperCase() : "SYSTEM";

        switch (type) {
            case "CLAIM":
                sb.append("Claim Number,User ID,Policy ID,Claim Amount,Approved Amount,Status,Created At\n");
                for (Claim c : claimRepository.findAll()) {
                    sb.append(c.getClaimNumber()).append(",")
                            .append(c.getUserId()).append(",")
                            .append(c.getPolicyId()).append(",")
                            .append(c.getClaimAmount()).append(",")
                            .append(c.getApprovedAmount()).append(",")
                            .append(c.getStatus()).append(",")
                            .append(c.getCreatedAt()).append("\n");
                }
                break;
            case "PAYMENT":
                sb.append("Transaction ID,User ID,Amount,Payment Method,Status,Payment Date\n");
                for (Payment p : paymentRepository.findAll()) {
                    sb.append(p.getTransactionId()).append(",")
                            .append(p.getUserId()).append(",")
                            .append(p.getAmount()).append(",")
                            .append(p.getPaymentMethod()).append(",")
                            .append(p.getStatus()).append(",")
                            .append(p.getCreatedAt()).append("\n");
                }
                break;
            case "POLICY":
                sb.append("Policy Number,Title,Policy Type,Coverage Amount,Premium Amount,Status\n");
                for (Policy pol : policyRepository.findAll()) {
                    sb.append(pol.getPolicyNumber()).append(",")
                            .append("\"").append(pol.getTitle()).append("\",")
                            .append(pol.getPolicyType()).append(",")
                            .append(pol.getCoverageAmount()).append(",")
                            .append(pol.getPremiumAmount()).append(",")
                            .append(pol.getStatus()).append("\n");
                }
                break;
            case "HOSPITAL":
                sb.append("Hospital Code,Hospital Name,Contact,Email,Status\n");
                for (Hospital h : hospitalRepository.findAll()) {
                    sb.append(h.getHospitalCode()).append(",")
                            .append("\"").append(h.getName()).append("\",")
                            .append(h.getContactNumber()).append(",")
                            .append(h.getEmail()).append(",")
                            .append(h.getStatus()).append("\n");
                }
                break;
            case "SUPPORT":
                sb.append("Ticket Number,User ID,Subject,Priority,Status,Created At\n");
                for (SupportTicket t : supportRepository.findAll()) {
                    sb.append(t.getTicketNumber()).append(",")
                            .append(t.getUserId()).append(",")
                            .append("\"").append(t.getSubject()).append("\",")
                            .append(t.getPriority()).append(",")
                            .append(t.getStatus()).append(",")
                            .append(t.getCreatedAt()).append("\n");
                }
                break;
            default:
                sb.append("ID,Username,Action,Description,Timestamp\n");
                for (AuditLog log : auditLogRepository.findAllByOrderByCreatedAtDesc()) {
                    sb.append(log.getId()).append(",")
                            .append(log.getUsername()).append(",")
                            .append(log.getAction()).append(",")
                            .append("\"").append(log.getDescription()).append("\",")
                            .append(log.getCreatedAt()).append("\n");
                }
                break;
        }

        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    @Override
    @Transactional(readOnly = true)
    public ModuleReportSummaryDTO getClaimsReport() {
        List<Claim> claims = claimRepository.findAll();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalClaimsCount", claims.size());

        BigDecimal totalClaimed = claims.stream().map(Claim::getClaimAmount).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalApproved = claims.stream().map(Claim::getApprovedAmount).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.put("totalClaimedAmount", totalClaimed);
        stats.put("totalApprovedAmount", totalApproved);

        Map<String, Long> byStatus = claims.stream()
                .collect(Collectors.groupingBy(c -> c.getStatus() != null ? c.getStatus().name() : "UNKNOWN", Collectors.counting()));
        stats.put("statusBreakdown", byStatus);

        List<Map<String, Object>> rows = claims.stream().map(c -> {
            Map<String, Object> map = new HashMap<>();
            map.put("claimNumber", c.getClaimNumber());
            map.put("userId", c.getUserId());
            map.put("claimAmount", c.getClaimAmount());
            map.put("approvedAmount", c.getApprovedAmount());
            map.put("status", c.getStatus() != null ? c.getStatus().name() : "");
            map.put("description", c.getDescription());
            map.put("createdAt", c.getCreatedAt());
            return map;
        }).collect(Collectors.toList());

        return new ModuleReportSummaryDTO("CLAIM", "Executive Claims Analytics Report", LocalDateTime.now(), stats, rows);
    }

    @Override
    @Transactional(readOnly = true)
    public ModuleReportSummaryDTO getPaymentsReport() {
        List<Payment> payments = paymentRepository.findAll();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalTransactions", payments.size());

        BigDecimal totalVal = payments.stream().map(Payment::getAmount).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.put("totalTransactionValue", totalVal);

        Map<String, Long> byStatus = payments.stream()
                .collect(Collectors.groupingBy(p -> p.getStatus() != null ? p.getStatus() : "UNKNOWN", Collectors.counting()));
        stats.put("statusBreakdown", byStatus);

        Map<String, Long> byMethod = payments.stream()
                .collect(Collectors.groupingBy(p -> p.getPaymentMethod() != null ? p.getPaymentMethod() : "UNKNOWN", Collectors.counting()));
        stats.put("methodBreakdown", byMethod);

        List<Map<String, Object>> rows = payments.stream().map(p -> {
            Map<String, Object> map = new HashMap<>();
            map.put("transactionId", p.getTransactionId());
            map.put("userId", p.getUserId());
            map.put("amount", p.getAmount());
            map.put("paymentMethod", p.getPaymentMethod());
            map.put("status", p.getStatus());
            map.put("createdAt", p.getCreatedAt());
            return map;
        }).collect(Collectors.toList());

        return new ModuleReportSummaryDTO("PAYMENT", "Payment Audit & Reconciliation Report", LocalDateTime.now(), stats, rows);
    }

    @Override
    @Transactional(readOnly = true)
    public ModuleReportSummaryDTO getPoliciesReport() {
        List<Policy> policies = policyRepository.findAll();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPolicies", policies.size());

        BigDecimal totalPremium = policies.stream().map(Policy::getPremiumAmount).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalCoverage = policies.stream().map(Policy::getCoverageAmount).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.put("totalAnnualPremiumVolume", totalPremium);
        stats.put("totalUnderwrittenCoverage", totalCoverage);

        Map<String, Long> byType = policies.stream()
                .collect(Collectors.groupingBy(p -> p.getPolicyType() != null ? p.getPolicyType() : "OTHER", Collectors.counting()));
        stats.put("typeBreakdown", byType);

        List<Map<String, Object>> rows = policies.stream().map(p -> {
            Map<String, Object> map = new HashMap<>();
            map.put("policyNumber", p.getPolicyNumber());
            map.put("title", p.getTitle());
            map.put("policyType", p.getPolicyType());
            map.put("coverageAmount", p.getCoverageAmount());
            map.put("premiumAmount", p.getPremiumAmount());
            map.put("status", p.getStatus());
            return map;
        }).collect(Collectors.toList());

        return new ModuleReportSummaryDTO("POLICY", "Insurance Policy Portfolio Summary", LocalDateTime.now(), stats, rows);
    }

    @Override
    @Transactional(readOnly = true)
    public ModuleReportSummaryDTO getHospitalsReport() {
        List<Hospital> hospitals = hospitalRepository.findAll();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalHospitals", hospitals.size());
        stats.put("empanelledCount", hospitals.stream().filter(h -> h.getStatus() == HospitalStatus.ACTIVE).count());
        stats.put("nonEmpanelledCount", hospitals.stream().filter(h -> h.getStatus() != HospitalStatus.ACTIVE).count());

        List<Map<String, Object>> rows = hospitals.stream().map(h -> {
            Map<String, Object> map = new HashMap<>();
            map.put("registrationNo", h.getHospitalCode());
            map.put("name", h.getName());
            map.put("contactNo", h.getContactNumber());
            map.put("email", h.getEmail());
            map.put("active", h.getStatus() == HospitalStatus.ACTIVE);
            return map;
        }).collect(Collectors.toList());

        return new ModuleReportSummaryDTO("HOSPITAL", "Network Hospital Accreditation Report", LocalDateTime.now(), stats, rows);
    }

    @Override
    @Transactional(readOnly = true)
    public ModuleReportSummaryDTO getSupportReport() {
        List<SupportTicket> tickets = supportRepository.findAll();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalTickets", tickets.size());
        stats.put("openTickets", tickets.stream().filter(t -> "OPEN".equalsIgnoreCase(t.getStatus())).count());
        stats.put("inProgressTickets", tickets.stream().filter(t -> "IN_PROGRESS".equalsIgnoreCase(t.getStatus())).count());
        stats.put("resolvedTickets", tickets.stream().filter(t -> "RESOLVED".equalsIgnoreCase(t.getStatus()) || "CLOSED".equalsIgnoreCase(t.getStatus())).count());

        Map<String, Long> byPriority = tickets.stream()
                .collect(Collectors.groupingBy(t -> t.getPriority() != null ? t.getPriority() : "MEDIUM", Collectors.counting()));
        stats.put("priorityBreakdown", byPriority);

        List<Map<String, Object>> rows = tickets.stream().map(t -> {
            Map<String, Object> map = new HashMap<>();
            map.put("ticketNumber", t.getTicketNumber());
            map.put("userId", t.getUserId());
            map.put("subject", t.getSubject());
            map.put("priority", t.getPriority());
            map.put("status", t.getStatus());
            map.put("createdAt", t.getCreatedAt());
            return map;
        }).collect(Collectors.toList());

        return new ModuleReportSummaryDTO("SUPPORT", "Customer Support & SLA Incident Report", LocalDateTime.now(), stats, rows);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLogDTO> getAuditLogs() {
        return auditLogRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::convertToAuditLogDTO)
                .collect(Collectors.toList());
    }
}
