package com.mlbb2g209.healthinsurance.support;

import com.mlbb2g209.healthinsurance.admin.User;
import com.mlbb2g209.healthinsurance.common.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "support_tickets")
@Data
public class SupportTicket extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ticket_number", nullable = false, unique = true, length = 50)
    private String ticketNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 150)
    private String subject;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(length = 30)
    private String status = "OPEN";

    @Column(length = 20)
    private String priority = "MEDIUM";

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
