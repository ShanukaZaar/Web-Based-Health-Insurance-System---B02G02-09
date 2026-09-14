package com.mlbb2g209.healthinsurance.support;

public class SupportDTO {

    private Long id;
    private String ticketNumber;
    private Long userId;
    private String subject;
    private String description;
    private String status;
    private String priority;

    public SupportDTO() {
    }

    public SupportDTO(Long id, String ticketNumber, Long userId, String subject, String description, String status, String priority) {
        this.id = id;
        this.ticketNumber = ticketNumber;
        this.userId = userId;
        this.subject = subject;
        this.description = description;
        this.status = status;
        this.priority = priority;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
