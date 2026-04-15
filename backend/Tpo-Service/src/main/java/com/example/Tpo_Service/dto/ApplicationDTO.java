package com.example.Tpo_Service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationDTO {
    private Long id;
    private Long studentId;
    private Long jdId;
    private String enrollmentNo;
    private String studentName;
    private LocalDateTime appliedDate;
}
