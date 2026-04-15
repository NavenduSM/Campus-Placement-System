package com.example.Notification_Service.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class JobPostedEvent {
    private Long jdId;
    private String companyName;
    private String role;
    private String location;
    private String salary;
    private String eligibleDegree;
    private List<String> eligibleCourses;
    private List<String> recipientEmails;
    private LocalDateTime postedAt;
}
