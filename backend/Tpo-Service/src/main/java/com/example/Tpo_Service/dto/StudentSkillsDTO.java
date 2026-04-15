package com.example.Tpo_Service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentSkillsDTO {

    private Long id;
    private String skillName;
    private String proficiencyLevel;
}
