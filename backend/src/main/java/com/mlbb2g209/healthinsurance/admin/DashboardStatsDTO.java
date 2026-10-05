package com.mlbb2g209.healthinsurance.admin;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class DashboardStatsDTO {

    private long totalUsers;
    private long activeUsers;
    private long totalPolicies;
    private long activePolicies;
    private long totalClaims;
    private long pendingClaims;
    private long totalPayments;
    private long networkHospitals;
    private long openSupportTickets;

    private BigDecimal totalClaimAmount;
    private BigDecimal totalApprovedClaimAmount;
    private BigDecimal totalPaymentAmount;

    private Map<String, Long> claimStatusDistribution;
    private Map<String, Long> paymentStatusDistribution;
    private Map<String, Long> policyStatusDistribution;
    private Map<String, Long> supportPriorityDistribution;

    private List<AuditLogDTO> recentAuditLogs;

    public DashboardStatsDTO() {
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getActiveUsers() {
        return activeUsers;
    }

    public void setActiveUsers(long activeUsers) {
        this.activeUsers = activeUsers;
    }

    public long getTotalPolicies() {
        return totalPolicies;
    }

    public void setTotalPolicies(long totalPolicies) {
        this.totalPolicies = totalPolicies;
    }

    public long getActivePolicies() {
        return activePolicies;
    }

    public void setActivePolicies(long activePolicies) {
        this.activePolicies = activePolicies;
    }

    public long getTotalClaims() {
        return totalClaims;
    }

    public void setTotalClaims(long totalClaims) {
        this.totalClaims = totalClaims;
    }

    public long getPendingClaims() {
        return pendingClaims;
    }

    public void setPendingClaims(long pendingClaims) {
        this.pendingClaims = pendingClaims;
    }

    public long getTotalPayments() {
        return totalPayments;
    }

    public void setTotalPayments(long totalPayments) {
        this.totalPayments = totalPayments;
    }

    public long getNetworkHospitals() {
        return networkHospitals;
    }

    public void setNetworkHospitals(long networkHospitals) {
        this.networkHospitals = networkHospitals;
    }

    public long getOpenSupportTickets() {
        return openSupportTickets;
    }

    public void setOpenSupportTickets(long openSupportTickets) {
        this.openSupportTickets = openSupportTickets;
    }

    public BigDecimal getTotalClaimAmount() {
        return totalClaimAmount;
    }

    public void setTotalClaimAmount(BigDecimal totalClaimAmount) {
        this.totalClaimAmount = totalClaimAmount;
    }

    public BigDecimal getTotalApprovedClaimAmount() {
        return totalApprovedClaimAmount;
    }

    public void setTotalApprovedClaimAmount(BigDecimal totalApprovedClaimAmount) {
        this.totalApprovedClaimAmount = totalApprovedClaimAmount;
    }

    public BigDecimal getTotalPaymentAmount() {
        return totalPaymentAmount;
    }

    public void setTotalPaymentAmount(BigDecimal totalPaymentAmount) {
        this.totalPaymentAmount = totalPaymentAmount;
    }

    public Map<String, Long> getClaimStatusDistribution() {
        return claimStatusDistribution;
    }

    public void setClaimStatusDistribution(Map<String, Long> claimStatusDistribution) {
        this.claimStatusDistribution = claimStatusDistribution;
    }

    public Map<String, Long> getPaymentStatusDistribution() {
        return paymentStatusDistribution;
    }

    public void setPaymentStatusDistribution(Map<String, Long> paymentStatusDistribution) {
        this.paymentStatusDistribution = paymentStatusDistribution;
    }

    public Map<String, Long> getPolicyStatusDistribution() {
        return policyStatusDistribution;
    }

    public void setPolicyStatusDistribution(Map<String, Long> policyStatusDistribution) {
        this.policyStatusDistribution = policyStatusDistribution;
    }

    public Map<String, Long> getSupportPriorityDistribution() {
        return supportPriorityDistribution;
    }

    public void setSupportPriorityDistribution(Map<String, Long> supportPriorityDistribution) {
        this.supportPriorityDistribution = supportPriorityDistribution;
    }

    public List<AuditLogDTO> getRecentAuditLogs() {
        return recentAuditLogs;
    }

    public void setRecentAuditLogs(List<AuditLogDTO> recentAuditLogs) {
        this.recentAuditLogs = recentAuditLogs;
    }
}
