package com.mlbb2g209.healthinsurance.support;

import com.mlbb2g209.healthinsurance.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "support_tickets")
public class SupportTicket extends BaseEntity {

    @Column(name = "ticket_number", nullable = false, unique = true)
    private String ticketNumber;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "subject", nullable = false)
    private String subject;

    @Column(name = "description", nullable = false, length = 2000)
    private String description;

    @Column(name = "status")
    private String status;

    @Column(name = "priority")
    private String priority;

    public SupportTicket() {
    }

    public SupportTicket(String ticketNumber, Long userId, String subject, String description, String status, String priority) {
        this.ticketNumber = ticketNumber;
        this.userId = userId;
        this.subject = subject;
        this.description = description;
        this.status = status;
        this.priority = priority;
    }

    public String getTicketNumber() {
        return ticketNumber;
    }

    public void setTicketNumber(String ticketNumber) {
        this.ticketNumber = ticketNumber;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }
}
