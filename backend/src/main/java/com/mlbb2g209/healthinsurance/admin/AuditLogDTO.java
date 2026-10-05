package com.mlbb2g209.healthinsurance.admin;

import java.time.LocalDateTime;

public class AuditLogDTO {

    private Long id;
    private Long userId;
    private String username;
    private String action;
    private String description;
    private LocalDateTime timestamp;

    public AuditLogDTO() {
    }

    public AuditLogDTO(Long id, Long userId, String username, String action, String description, LocalDateTime timestamp) {
        this.id = id;
        this.userId = userId;
        this.username = username;
        this.action = action;
        this.description = description;
        this.timestamp = timestamp;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
