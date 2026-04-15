package com.example.Tpo_Service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentSpecialCriteriaDTO {

    private Long id;
    private String criteriaName;
    private String value;
}
