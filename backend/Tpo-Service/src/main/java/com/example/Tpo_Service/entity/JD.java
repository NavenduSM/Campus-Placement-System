package com.example.Tpo_Service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "job_descriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class JD {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String companyName;
    private String jobDescription;

    @ElementCollection
    @CollectionTable(name = "jd_skills_required", joinColumns = @JoinColumn(name = "jd_id"))
    @Column(name = "skill")
    private List<String> skillsRequired;

    private LocalDate dateOfApply;
    private String role;
    private String salary;
    private String location;
    private String bond;
    private String eligibleDegree;
    private String selectionProcess;
    private String specialCriterion;
}
