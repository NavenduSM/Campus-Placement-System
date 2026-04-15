package com.example.Tpo_Service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentAcademicsDTO {

    private Long id;
    private String semester;
    private String subject;
    private Double marks;
    private Double maxMarks;
}
