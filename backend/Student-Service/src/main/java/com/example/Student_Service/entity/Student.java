package com.example.Student_Service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Integer age;
    private String email;
    private String enrollmentNumber;
    private String course;
    private String courseSpecialisation;
    private String phone;
    private String alternatePhone;
    private String address;
    private String resumePath; // Path to resume file in file system

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<StudentSkills> skills;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<StudentAcademics> academics;

    @OneToOne(mappedBy = "student", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private StudentSpecialCriteria specialCriteria;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getEnrollmentNumber() {
        return enrollmentNumber;
    }

    public void setEnrollmentNumber(String enrollmentNumber) {
        this.enrollmentNumber = enrollmentNumber;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public String getCourseSpecialisation() {
        return courseSpecialisation;
    }

    public void setCourseSpecialisation(String courseSpecialisation) {
        this.courseSpecialisation = courseSpecialisation;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAlternatePhone() {
        return alternatePhone;
    }

    public void setAlternatePhone(String alternatePhone) {
        this.alternatePhone = alternatePhone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getResumePath() {
        return resumePath;
    }

    public void setResumePath(String resumePath) {
        this.resumePath = resumePath;
    }

    public List<StudentSkills> getSkills() {
        return skills;
    }

    public void setSkills(List<StudentSkills> skills) {
        this.skills = skills;
    }

    public List<StudentAcademics> getAcademics() {
        return academics;
    }

    public void setAcademics(List<StudentAcademics> academics) {
        this.academics = academics;
    }

    public StudentSpecialCriteria getSpecialCriteria() {
        return specialCriteria;
    }

    public void setSpecialCriteria(StudentSpecialCriteria specialCriteria) {
        this.specialCriteria = specialCriteria;
    }


    public Object getEnrollmentNo() {
        return enrollmentNumber;
    }
}
