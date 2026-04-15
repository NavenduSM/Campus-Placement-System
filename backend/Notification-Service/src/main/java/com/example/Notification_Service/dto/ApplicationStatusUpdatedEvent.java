package com.example.Notification_Service.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ApplicationStatusUpdatedEvent {
    private Long applicationId;
    private Long studentId;
    private Long jdId;
    private String enrollmentNo;
    private String studentName;
    private String studentEmail;
    private String previousStatus;
    private String newStatus;
    private LocalDateTime updatedAt;
}
