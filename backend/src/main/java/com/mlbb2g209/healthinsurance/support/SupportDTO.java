package com.mlbb2g209.healthinsurance.support;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SupportDTO {

    private Long id;

    private String ticketNumber;

    private Long userId;

    @NotBlank(message = "Subject is required")
    @Size(max = 150, message = "Subject must not exceed 150 characters")
    private String subject;

    @NotBlank(message = "Description is required")
    private String description;

    private String status;

    private String priority;

    private String createdAt;

    private String updatedAt;
}
