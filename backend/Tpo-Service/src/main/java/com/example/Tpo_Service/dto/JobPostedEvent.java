package com.example.Tpo_Service.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
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
