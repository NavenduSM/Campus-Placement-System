package com.example.Student_Service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "student_special_criteria")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentSpecialCriteria {

    @Id
    @Column(name = "student_id")
    private Long studentId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "student_id")
    private Student student;

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Boolean getHasBacklog() {
        return hasBacklog;
    }

    public void setHasBacklog(Boolean hasBacklog) {
        this.hasBacklog = hasBacklog;
    }

    public Boolean getGapYear() {
        return gapYear;
    }

    public void setGapYear(Boolean gapYear) {
        this.gapYear = gapYear;
    }

    public Boolean getComputerScience() {
        return computerScience;
    }

    public void setComputerScience(Boolean computerScience) {
        this.computerScience = computerScience;
    }

    public Boolean getMathematics() {
        return mathematics;
    }

    public void setMathematics(Boolean mathematics) {
        this.mathematics = mathematics;
    }

    public Boolean getCommerce() {
        return commerce;
    }

    public void setCommerce(Boolean commerce) {
        this.commerce = commerce;
    }

    public Boolean getArts() {
        return arts;
    }

    public void setArts(Boolean arts) {
        this.arts = arts;
    }

    public Boolean getScience() {
        return science;
    }

    public void setScience(Boolean science) {
        this.science = science;
    }

    private Boolean hasBacklog;
    private Boolean gapYear;
    private Boolean computerScience;
    private Boolean mathematics;
    private Boolean commerce;
    private Boolean arts;
    private Boolean science;
}
